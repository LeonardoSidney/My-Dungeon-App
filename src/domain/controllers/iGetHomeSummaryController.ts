import type { ActivityHighlights, StorySummary } from '@domain/services';
import type { HomeCatalogCounts } from '@domain/use-cases';
import type { DetailControllerResponse } from '@domain/controllers/iCrudControllerResponses';

export interface IGetHomeSummaryController {
    handle (): Promise<GetHomeSummaryControllerResponse>;
}

export type HomeAdventureView = {
    id: string;
    name: string;
    createdAt: string;
    lastActivityAt: string;
    messageCount: number;
    lastMessage?: string;
};

export type HomeDailyActivityView = {
    date: string;
    messageCount: number;
};

export type HomeSummaryView = {
    counts: HomeCatalogCounts;
    adventures: HomeAdventureView[];
    story: StorySummary;
    dailyActivity: HomeDailyActivityView[];
    streak: number;
    highlights: ActivityHighlights;
};

export type GetHomeSummaryControllerResponse = DetailControllerResponse<HomeSummaryView>;
