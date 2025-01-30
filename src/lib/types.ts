export enum BotNames {
    funny = 'funny',
    sorry = 'sorry',
    curse = 'curse',
    minecraft = 'minecraft'
}

export type SelectedBotName = BotNames | null;

export interface BotRestartRequest {
    bot: string;
}

export interface ActionResetRequest {
    bot: string;
    data: {
        chatName: string;
        name: string;
    };
}

export interface TraceGroup {
    rows: string[];
    traceId: string;
    botName: string;
    chatName: string;
}

export enum ActionType {
    Command,
    Scheduled
}

export interface FunnyBotActionMetadata {
    type: ActionType;
    triggers: string[];
    name: string;
    key: string;
    chatBlacklists: number[];
    chatsWhitelist: number[];
    timeInHours: number;
    allowedUsers: number[];
    cooldownInSeconds: number;
}

export interface BotPageProps {
    log: TraceGroup[];
    storedChatData: Record<string, Record<string, unknown>>;
    actionsMetadata: Map<string, FunnyBotActionMetadata>;
    botName: string;
}

interface BotLog {
    botName: string;
    traceId: string | number;
    errorObj: string | Error;
    extraData?: unknown;
    chatName: string;
}

interface BotError {
    botName: string;
    traceId: string | number;
    text: string;
    chatName: string;
}

export type LogEntry = BotLog | BotError;
