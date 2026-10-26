import type { HomeSummaryView } from '@domain/controllers';
import { IGetHomeSummaryPresenter } from '@domain/presenters';
import type { HomeSummary } from '@domain/use-cases';

export class GetHomeSummaryPresenter implements IGetHomeSummaryPresenter {
    present (summary: HomeSummary): HomeSummaryView {
        const { counts, activity } = summary;

        return {
            counts,
            adventures: activity.adventures.map(adventure => ({
                id: adventure.id,
                name: adventure.name,
                createdAt: adventure.createdAt.toISOString(),
                lastActivityAt: adventure.lastActivityAt.toISOString(),
                messageCount: adventure.messageCount,
                lastMessage: adventure.lastMessage,
            })),
            story: activity.story,
            dailyActivity: activity.dailyActivity.map(day => ({
                date: day.date.toISOString(),
                messageCount: day.messageCount,
            })),
            streak: activity.streak,
            highlights: activity.highlights,
        };
    }
}
