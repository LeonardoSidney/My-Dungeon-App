import type { ActivitySummary } from '@domain/services';

export interface IGetHomeSummaryUseCase {
    execute (params?: GetHomeSummaryUseCaseParams): Promise<GetHomeSummaryUseCaseReturn>;
}

export type GetHomeSummaryUseCaseParams = {
    now?: Date;
};

export type HomeCatalogCounts = {
    adventures: number;
    characters: number;
    worldMasters: number;
    worlds: number;
    locations: number;
    items: number;
    abilities: number;
    proficiencies: number;
    statuses: number;
    systemPrompts: number;
    assistants: number;
    samplers: number;
    connections: number;
};

export type HomeSummary = {
    counts: HomeCatalogCounts;
    activity: ActivitySummary;
};

export type GetHomeSummaryUseCaseReturn = {
    success: boolean;
    summary?: HomeSummary;
    error?: string;
};

export type HomeSummaryListResponse = {
    success: boolean;
    error?: string;
};
