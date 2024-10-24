import { currentBot } from "$lib/stores.svelte";
import { error } from '@sveltejs/kit';

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function post(url: string, data: any = null) {
    const requestBody = data == null
        ? { bot: currentBot.name }
        : {
            bot: currentBot.name,
            data: data,
          };

    return fetch(url, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export function forbidden(reason: string = "") : never {
    console.trace(`Returning HTTP 403: ${reason}`);
    error(403, { message: `Forbidden: ${reason}` });
}