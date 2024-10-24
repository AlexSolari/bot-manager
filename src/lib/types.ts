export enum BotNames {
    funny = "funny",
    sorry = "sorry",
    curse = "curse",
    minecraft = "minecraft"
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

export enum ActionType{
    Command,
    Scheduled
}

export interface FunnyBotActionMetadata{
    type: ActionType
    triggers: string[],
    name: string,
    key: string,
    chatBlacklists: number[],
    chatsWhitelist: number[],
    timeInHours: number,
    allowedUsers: number[],
    cooldownInSeconds: number
}

export interface BotPageProps{
    log: TraceGroup[],
    storedChatData: Record<string, Record<string, unknown>>,
    actionsMetadata: Map<string, FunnyBotActionMetadata>,
    botName: string
}