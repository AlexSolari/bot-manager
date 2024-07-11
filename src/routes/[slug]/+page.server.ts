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
        .map(x => x.split(']: ')[1] ?? x);

    const groups = new Array<TraceGroup>();

    if (botName == BotNames.funny) {
        const tracesToRowsMap = new Map<string, number>();
        logEntries.forEach((row, i) => {
            const matchResult = (/(?<traceId>TRACE\S+)? ?(?<message>.+)/i).exec(row);
            const traceId = matchResult?.groups?.traceId ?? `TRACE:UNKNOWN:${i}`;

            if (tracesToRowsMap.has(traceId)) {
                const rowNumber = tracesToRowsMap.get(traceId) as number;
                groups[rowNumber].rows.push(matchResult?.groups?.message ?? "");
            }
            else if (matchResult?.groups?.message){
                const newArray = [matchResult?.groups?.message];
                const newGroup = {
                    rows: newArray,
                    traceId: traceId
                } as TraceGroup;

                groups.push(newGroup);

                tracesToRowsMap.set(traceId, groups.length - 1);
            }
        });
    }
    else {
        logEntries.forEach(x => {
            const newGroup = {
                rows: [x],
                traceId: ""
            } as TraceGroup;

            return groups.push(newGroup);
        });
    }

    return {
        log: groups.toReversed(),
        botName
    };
}