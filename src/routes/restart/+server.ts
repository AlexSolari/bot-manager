import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec);
import { json } from "@sveltejs/kit";
import { forbidden, isSignedOn } from '$lib/index.server';
import { BotNames, type BotRestartRequest } from '$lib/types.js';

export async function POST({ cookies, request }) {
    const isLoggedIn = await isSignedOn(cookies);
    if (!isLoggedIn) {
        forbidden("Not logged in.");
    }

    const requestBody = await request.json() as BotRestartRequest;
    if (!(requestBody.bot in BotNames)) {
        forbidden("Invalid bot name.")
    }

    if (import.meta.env.MODE == "development") {
        console.log("restart requested for bot " + requestBody.bot)
    }
    else {
        (await execAsync(`sudo systemctl restart ` + requestBody.bot + `.service`)).stdout;
    }

    return json(true);
}