import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec);
import { error, json } from "@sveltejs/kit";
import { isSignedOn } from '$lib/index.server';

export async function POST({ cookies, request }) {
    const isLoggedIn = await isSignedOn(cookies);
    if (!isLoggedIn) {
        error(405, { message: "not allowed" });
    }

    const botName = (await request.json()).bot;

    if (import.meta.env.MODE == "development") {
        console.log("restart requested for bot " + botName)
    }
    else {
        await (await execAsync(`sudo systemctl restart ` + botName + `.service`)).stdout;
    }

    return json(true);
}