import { isSignedOn, forbidden } from '$lib/index.server';
import { BotNames, type TraceGroup } from '$lib/types';
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec);

export async function load({ cookies, params }) {
    const botName = params.slug;

    const isLoggedIn = await isSignedOn(cookies);
    if (!isLoggedIn) {
        forbidden("Not logged in.");
    }

    if (!(botName in BotNames)) {
        forbidden("Invalid bot name.");
    }

    const logs = import.meta.env.MODE == "development"
        ? (await execAsync(`Get-Content "D:\\!src\\bot-manager\\dummy-data\\` + botName + `.txt"`, { 'shell': 'powershell.exe' })).stdout
        : (await execAsync(`sudo journalctl -u ` + botName + `.service -n 100`)).stdout;

    
    const logEntries = logs
        .split('\n')
        .map(x => x.split(']: ').slice(1).join());

    const groups = new Array<TraceGroup>();

    if (botName == BotNames.funny) {
        const tracesToRowsMap = new Map<string, number>();
        logEntries.forEach((row, i) => {
            const matchResult = (/(?<traceId>TRACE\S+)? ?(?<message>.+)/i).exec(row);
            const traceIdFromMessage = matchResult?.groups?.traceId;
            const messageData = matchResult?.groups?.message ?? "";   
            const messageDataStack = messageData.split('|');
            const message = messageDataStack.pop() ?? "";
            const chatName = messageDataStack.pop() ?? "";
            const botName = messageDataStack.pop() ?? "";
            
            const traceId = traceIdFromMessage ?? `TRACE:UNKNOWN:${i}`;

            if (tracesToRowsMap.has(traceId)) {
                const rowNumber = tracesToRowsMap.get(traceId) as number;
                groups[rowNumber].rows.push(message);
            }
            else if (matchResult?.groups?.message) {
                if (groups.length == 0 || traceIdFromMessage) {
                    const newArray = [message];
                    const newGroup = {
                        rows: newArray,
                        traceId: traceId,
                        botName: botName,
                        chatName: chatName
                    } as TraceGroup;

                    groups.push(newGroup);
                }
                else {
                    const lastGroup = groups.at(-1);

                    lastGroup?.rows.push(message)
                }

                tracesToRowsMap.set(traceId, groups.length - 1);
            }
        });
    }
    else {
        logEntries.forEach(x => {
            const newGroup = {
                rows: [x],
                traceId: "",
                botName: "",
                chatName: ""
            } as TraceGroup;

            groups.push(newGroup);
        });
    }

    return {
        log: groups.toReversed(),
        botName
    };
}