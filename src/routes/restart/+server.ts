import { json } from "@sveltejs/kit";
import { isSignedOn } from '$lib/auth.server';
import { BotNames, type BotRestartRequest } from '$lib/types.js';
import { restartBot } from '$lib/systemCalls.js';
import { forbidden } from "$lib";

export async function POST({ cookies, request }) {
    const isLoggedIn = await isSignedOn(cookies);
    if (!isLoggedIn) {
        forbidden("Not logged in.");
    }

    const requestBody = await request.json() as BotRestartRequest;
    if (!(requestBody.bot in BotNames)) {
        forbidden("Invalid bot name.")
    }

    await restartBot(requestBody.bot);

    return json(true);
}