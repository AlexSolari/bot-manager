import { error, json } from '@sveltejs/kit';
import { isSignedOn } from '$lib/auth.server';
import { BotNames, type ActionResetRequest } from '$lib/types.js';
import { getStorageFiles } from '$lib/systemCalls.js';
import { forbidden } from '$lib';
import { readFile } from 'fs/promises';
import { ChatId } from '$lib/chatIds.js';

export async function POST({ cookies, request }) {
    const isLoggedIn = await isSignedOn(cookies);
    if (!isLoggedIn) {
        forbidden('Not logged in.');
    }

    const requestBody = (await request.json()) as ActionResetRequest;
    if (!(requestBody.bot in BotNames)) {
        forbidden('Invalid bot name.');
    }

    const files = await getStorageFiles();
    const path = files.find((x) =>
        x.includes(requestBody.data.name.replaceAll('.', '-') + '.json')
    );

    if (!path) {
        error(404);
    }

    const storedData = await readFile(path, { encoding: 'utf8' });
    const chatId = ChatId[requestBody.data.chatName as keyof typeof ChatId];
    return json(JSON.parse(storedData)[chatId]);
}
