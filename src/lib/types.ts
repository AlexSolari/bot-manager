export enum BotNames {
    funny = "funny",
    sorry = "sorry",
    curse = "curse"
}

export type SelectedBotName = BotNames | null;

export interface BotRestartRequest {
    bot: string
}