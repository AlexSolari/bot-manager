import { get as getFromStore } from 'svelte/store';
import { currentBot as botStore } from "$lib/stores";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function post(url: string, data: any = null): Promise<Response> {
    const currentBot = getFromStore(botStore);
    const requestBody = data == null
        ? { bot: currentBot }
        : {
            bot: currentBot,
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