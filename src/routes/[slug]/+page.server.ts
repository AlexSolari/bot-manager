import { isSignedOn } from '$lib/index.server';
import { error } from '@sveltejs/kit';
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec);

export async function load({ cookies, params }) {
    const botName = params.slug;

    const isLoggedIn = await isSignedOn(cookies);
    if (!isLoggedIn) {
        error(405, { message: "not allowed" });
    }

    const logs = import.meta.env.MODE == "development"
        ? await (await execAsync(`Get-Content "C:\\Users\\Cheezie\\Desktop\\bot-manager\\dummy-data\\` + botName + `.txt"`, { 'shell': 'powershell.exe' })).stdout
        : await (await execAsync(`sudo journalctl -u ` + botName + `.service -n 100`)).stdout;

    const reversedLog = logs.split('\n').toReversed();

    return {
        log: reversedLog,
        botName
    };
}