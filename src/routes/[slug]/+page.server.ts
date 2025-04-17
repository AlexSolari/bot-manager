import { ChatId } from '$lib/chatIds.js';
import { isSignedOn } from '$lib/auth.server';
import {
    ActionType,
    BotNames,
    type BotPageProps,
    type FunnyBotActionMetadata,
    type LogEntry,
    type TraceGroup
} from '$lib/types';
import { readFile } from 'fs/promises';
import {
    getLogs,
    getMetadataFiles,
    getStorageFiles
} from '../../lib/systemCalls';
import { forbidden } from '$lib';

const mcServerPerfixRegex = /\[Server thread\/\S{4}./gi;
const actionsMetadata: Map<string, FunnyBotActionMetadata> = new Map();

function isJsonLike(row: string) {
    return row.at(0) == '{' && row.at(-1) == '}';
}

export async function load({ cookies, params }) {
    const botName = params.slug;

    const isLoggedIn = await isSignedOn(cookies);
    if (!isLoggedIn) {
        forbidden('Not logged in.');
    }

    if (!(botName in BotNames)) {
        forbidden('Invalid bot name.');
    }
    const isMinecraft = botName == BotNames.minecraft;

    const logs = await getLogs(botName, isMinecraft ? 35 : 100);
    const logEntries = logs
        .split('\n')
        .filter(
            (x) =>
                x.includes('node[') || x.includes('bun[') || x.includes('java[')
        )
        .map((x) => x.split(']: ').slice(1).join())
        .filter((x) => x);

    const filesData: Record<
        string,
        Record<string, Record<string, unknown>>
    > = {};

    const groups =
        botName == BotNames.funny
            ? await processLogsForFunnyBot(logEntries, filesData)
            : processLogsGeneric(logEntries, isMinecraft);

    return {
        log: isMinecraft ? groups : groups.toReversed(),
        storedChatData: actionsDataToChatData(filesData),
        actionsMetadata: actionsMetadata,
        botName
    } as BotPageProps;
}

function processLogsGeneric(logEntries: string[], isMinecraft: boolean) {
    const groups = new Array<TraceGroup>();
    logEntries.forEach((x) => {
        const logRow = isMinecraft ? x.replaceAll(mcServerPerfixRegex, '') : x;

        const newGroup = {
            rows: [logRow],
            traceId: '',
            botName: '',
            chatName: ''
        } as TraceGroup;

        groups.push(newGroup);
    });
    return groups;
}

async function processLogsForFunnyBot(
    logEntries: string[],
    filesData: Record<string, Record<string, Record<string, unknown>>>
) {
    const groups = new Array<TraceGroup>();
    const tracesToRowsMap = new Map<string, number>();

    let rowAccum = '';
    for (const row of logEntries) {
        rowAccum += row;

        if (!isJsonLike(rowAccum)) {
            continue;
        }
        const entry = JSON.parse(rowAccum) as LogEntry;
        rowAccum = '';

        const message =
            'text' in entry ? entry.text : JSON.stringify(entry.errorObj);
        const chatName = entry.chatName;
        const botName = entry.botName;
        const traceId =
            entry.traceId.toString() ?? `TRACE:UNKNOWN:${Math.random()}`;

        if (tracesToRowsMap.has(traceId)) {
            const rowNumber = tracesToRowsMap.get(traceId)!;
            groups[rowNumber].rows.push(message);
        } else {
            const newArray = [message];
            const newGroup = {
                rows: newArray,
                traceId: traceId,
                botName: botName,
                chatName: chatName
            } as TraceGroup;

            groups.push(newGroup);

            tracesToRowsMap.set(traceId, groups.length - 1);
        }
    }

    if (actionsMetadata.size == 0) {
        await loadMetadata();
    }

    const storageFiles = await getStorageFiles();

    const storageFilePromises = storageFiles.map((path) => {
        return {
            name:
                import.meta.env.MODE == 'development'
                    ? path.split('\\').at(-1)!.slice(0, -5)
                    : path.split('/').at(-1)!.slice(0, -5),
            content: readFile(path, { encoding: 'utf8' })
        };
    });

    for (const promise of storageFilePromises) {
        filesData[promise.name] = JSON.parse(await promise.content);
    }

    return groups;
}

async function loadMetadata() {
    const metadataFiles = await getMetadataFiles();

    const metadataFilesPromises = metadataFiles.map((path) =>
        readFile(path, { encoding: 'utf8' })
    );

    for (const promise of metadataFilesPromises) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (JSON.parse(await promise) as any[])
            .map(
                (x) =>
                    ({
                        name: x.name,
                        key: x.key,
                        chatBlacklists: x.chatBlacklists ?? [],
                        chatsWhitelist: x.chatsWhitelist ?? [],
                        timeInHours: x.timeinHours,
                        allowedUsers: x.allowedUsers ?? [],
                        cooldownInSeconds: x.cooldownInSeconds,
                        triggers: (x.triggers ?? []).filter(
                            (s: string | unknown) => typeof s == 'string'
                        ),
                        type:
                            x.timeinHours != undefined
                                ? ActionType.Scheduled
                                : ActionType.Command
                    } as FunnyBotActionMetadata)
            )
            .forEach((x) => actionsMetadata.set(x.key.split(':').at(-1)!, x));
    }
}

function actionsDataToChatData(
    actionsData: Record<string, Record<string, unknown>>
): Record<string, Record<string, unknown>> {
    const chatData = {} as Record<string, Record<string, unknown>>;

    for (const name in actionsData) {
        const idObject = actionsData[name];

        for (const id in idObject) {
            const obj = idObject[id];
            const chatName = ChatId[Number.parseInt(id)] as string | undefined;

            if (!chatName) {
                continue;
            }

            if (!chatData[chatName]) {
                chatData[chatName] = {};
            }
            chatData[chatName][name] = obj;
        }
    }

    return chatData;
}
