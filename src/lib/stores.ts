import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { SelectedBotName } from './types';

const stored = (browser ? localStorage.content || null : null) as SelectedBotName;
export const currentBot = writable(stored);

currentBot.subscribe((value) => {
    if (browser && value){
        localStorage.content = value;
    }
})