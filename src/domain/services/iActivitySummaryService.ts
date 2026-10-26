import type { Adventure, Character } from '@domain/entities';

export interface IActivitySummaryService {
    summarize (params: ActivitySummaryServiceParams): ActivitySummary;
}

export type ActivitySummaryServiceParams = {
    adventures: Adventure[];
    characters: Character[];
    now: Date;
};

export type AdventureActivity = {
    id: string;
    name: string;
    createdAt: Date;
    lastActivityAt: Date;
    messageCount: number;
    lastMessage?: string;
};

export type StorySummary = {
    linesWritten: number;
    repliesGenerated: number;
    wordsGenerated: number;
    rerolls: number;
};

export type DailyActivity = {
    date: Date;
    messageCount: number;
};

export type AdventureHighlight = {
    adventureId: string;
    name: string;
    messageCount: number;
};

export type CharacterHighlight = {
    characterId: string;
    name: string;
    lineCount: number;
};

export type ModelHighlight = {
    modelId: string;
    replyCount: number;
};

export type ActivityHighlights = {
    mostPlayed?: AdventureHighlight;
    hero?: CharacterHighlight;
    topModel?: ModelHighlight;
};

export type ActivitySummary = {
    adventures: AdventureActivity[];
    story: StorySummary;
    dailyActivity: DailyActivity[];
    streak: number;
    highlights: ActivityHighlights;
};

export const ACTIVITY_DAYS = 7;

export const WORD_SEPARATOR = /\s+/;
