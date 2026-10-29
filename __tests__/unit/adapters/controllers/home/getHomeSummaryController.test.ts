import { GetHomeSummaryController } from '@adapters/controllers';
import { GetHomeSummaryPresenter } from '@adapters/presenters';
import { ILogger } from '@domain/logger';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const counts = {
    adventures: 1,
    characters: 2,
    worldMasters: 0,
    worlds: 0,
    locations: 0,
    items: 0,
    abilities: 0,
    proficiencies: 0,
    statuses: 0,
    systemPrompts: 1,
    assistants: 1,
    samplers: 1,
    connections: 1,
};

const story = { linesWritten: 2, repliesGenerated: 2, wordsGenerated: 12, rerolls: 1 };
const highlights = { topModel: { modelId: 'qwen3', replyCount: 2 } };

const summary = {
    counts,
    activity: {
        adventures: [{
            id: 'adv-1',
            name: 'The Lost Kingdom',
            createdAt: new Date('2026-10-01T10:00:00.000Z'),
            lastActivityAt: new Date('2026-10-26T10:00:00.000Z'),
            messageCount: 4,
            lastMessage: 'It creaks open',
        }],
        story,
        dailyActivity: [{ date: new Date('2026-10-26T00:00:00.000Z'), messageCount: 4 }],
        streak: 1,
        highlights,
    },
};

describe('GetHomeSummaryController', () => {
    it('presents the summary with dates as ISO text', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, summary });

        const response = await new GetHomeSummaryController(logger, { execute }, new GetHomeSummaryPresenter()).handle();

        expect(response).toEqual({
            success: true,
            error: undefined,
            data: {
                counts,
                adventures: [{
                    id: 'adv-1',
                    name: 'The Lost Kingdom',
                    createdAt: '2026-10-01T10:00:00.000Z',
                    lastActivityAt: '2026-10-26T10:00:00.000Z',
                    messageCount: 4,
                    lastMessage: 'It creaks open',
                }],
                story,
                dailyActivity: [{ date: '2026-10-26T00:00:00.000Z', messageCount: 4 }],
                streak: 1,
                highlights,
            },
        });
    });

    it('passes the error along without data when the summary fails', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'Storage unavailable' });

        const response = await new GetHomeSummaryController(logger, { execute }, new GetHomeSummaryPresenter()).handle();

        expect(response).toEqual({ success: false, data: undefined, error: 'Storage unavailable' });
    });
});
