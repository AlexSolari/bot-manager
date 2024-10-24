import type { SelectedBotName } from './types';

export const currentBot = $state({
    name: null as SelectedBotName
});