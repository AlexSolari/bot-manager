import { get as getFromStore } from 'svelte/store';
import { currentBot as botStore } from "$lib/stores";

export function get(url: string, data: any = {}): Promise<Response> {
    const currentBot = getFromStore(botStore);
    const dataWithUser = { bot: currentBot, ...data };
    const urlWithQuery = `${url}?${new URLSearchParams(dataWithUser)}`;

    return fetch(urlWithQuery);
}

export function post(url: string, data: any = {}): Promise<Response> {
    const currentBot = getFromStore(botStore);

    return fetch(url, {
        method: "POST",
        body: JSON.stringify({
            bot: currentBot,
            data: data,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
}