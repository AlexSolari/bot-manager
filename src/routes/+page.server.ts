import {
    getCorrectPasswordHash,
    isPasswordCorrect,
    isSignedOn
} from '$lib/auth.server';
import { currentBot } from '$lib/stores.svelte.js';
import { BotNames } from '$lib/types.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const isLoggedIn = await isSignedOn(cookies);
    if (isLoggedIn) {
        redirect(303, BotNames.funny);
    }
}

export const actions = {
    auth: async function ({ cookies, request }) {
        const body = await request.formData();
        const password = body.get('password') as string;
        console.log('login attempt with ' + password);

        if (await isPasswordCorrect(password)) {
            cookies.set('sessionid', await getCorrectPasswordHash(), {
                path: '/',
                secure: false,
                httpOnly: false
            });
            currentBot.name = BotNames.funny;
            redirect(303, BotNames.funny);
        }

        return { success: false };
    }
};
