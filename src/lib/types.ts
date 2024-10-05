export enum BotNames {
    funny = "funny",
    sorry = "sorry",
    curse = "curse"
}

export type SelectedBotName = BotNames | null;

export interface BotRestartRequest {
    bot: string
}

export interface TraceGroup{
    rows: string[],
    traceId: string,
    botName: string,
    chatName: string,
}