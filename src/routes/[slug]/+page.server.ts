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

const actionsMetadata: Map<string, FunnyBotActionMetadata> = new Map();

export async function load({ cookies, params }) {
    const botName = params.slug;

    const isLoggedIn = await isSignedOn(cookies);
    if (!isLoggedIn) {
        forbidden('Not logged in.');
    }

    if (!(botName in BotNames)) {
        forbidden('Invalid bot name.');
    }
    const logs = await getLogs(botName);
    const logEntries = logs
        .split('\n')
        .filter((x) => x.includes('node'))
        .map((x) => x.split(']: ').slice(1).join())
        .filter((x) => x);

    const groups = new Array<TraceGroup>();
    const filesData: Record<
        string,
        Record<string, Record<string, unknown>>
    > = {};

    if (botName == BotNames.funny) {
        const tracesToRowsMap = new Map<string, number>();
        logEntries
            .map((x) => JSON.parse(x) as LogEntry)
            .forEach((row, i) => {
                const message =
                    'text' in row ? row.text : JSON.stringify(row.errorObj);
                const chatName = row.chatName;
                const botName = row.botName;
                const traceId = row.traceId.toString() ?? `TRACE:UNKNOWN:${i}`;

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
            });

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
    } else {
        logEntries.forEach((x) => {
            const newGroup = {
                rows: [x],
                traceId: '',
                botName: '',
                chatName: ''
            } as TraceGroup;

            groups.push(newGroup);
        });
    }

    return {
        log: groups.toReversed(),
        storedChatData: actionsDataToChatData(filesData),
        actionsMetadata: actionsMetadata,
        botName
    } as BotPageProps;
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
