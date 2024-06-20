import { writable } from 'svelte/store';
import type { SelectedBotName } from './types';

export const currentBot = writable(null as SelectedBotName);