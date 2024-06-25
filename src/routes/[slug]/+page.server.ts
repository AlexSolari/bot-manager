import { isSignedOn, forbidden } from '$lib/index.server';
import { BotNames } from '$lib/types';
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
        ? (await execAsync(`Get-Content "C:\\Users\\Cheezie\\Desktop\\bot-manager\\dummy-data\\` + botName + `.txt"`, { 'shell': 'powershell.exe' })).stdout
        : (await execAsync(`sudo journalctl -u ` + botName + `.service -n 100`)).stdout;

    const logEntries = logs
        .split('\n')
        .map(x => x.split(']: ')[1] ?? x);

    const tracesToRowsMap = new Map<string, number>();
    const groups = new Array<Array<string>>();
    logEntries.forEach((row) => {
        const foo = (/(?<traceId>TRACE\d+)? ?(?<message>.+)/i).exec(row);
        
        if (foo?.groups?.traceId){
            const traceId = foo?.groups?.traceId;

            if (tracesToRowsMap.has(traceId)){
                const rowNumber = tracesToRowsMap.get(traceId) as number;
                groups[rowNumber].push(foo?.groups?.message);
            }
            else{
                const newArray = [foo?.groups?.message];
                groups.push(newArray);
                tracesToRowsMap.set(traceId, groups.indexOf(newArray));
            }
        }
        else{
            const lastMessage = groups.at(-1) as string[];
            lastMessage.push(foo?.groups?.message ?? "");
        }
    });
        
    return {
        log: groups.toReversed(),
        botName
    };
}