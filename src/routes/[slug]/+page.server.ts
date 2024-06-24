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

    const reversedLog = logs.split('\n').map(x => x.split(']: ')[1] ?? x).toReversed();

    return {
        log: reversedLog,
        botName
    };
}