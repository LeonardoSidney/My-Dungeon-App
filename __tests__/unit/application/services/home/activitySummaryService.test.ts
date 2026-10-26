import { ActivitySummaryService } from '@application/services';
import { RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createCharacterHelper, createChatHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const at = (day: number, hour = 10, minute = 0) => new Date(2026, 9, day, hour, minute);

function chat (id: string, role: RoleEnum, characterId: string, content: string[], date: Date, extra = {}) {
    return createChatHelper({ id, role, characterId, content, index: content.length - 1, createdAt: date, updatedAt: date, ...extra });
}

const lostKingdom = createAdventureHelper({
    id: 'adv-1',
    name: 'The Lost Kingdom',
    createdAt: at(1),
    chat: [
        chat('c-1', RoleEnum.USER, 'aria', ['I open the door'], at(25)),
        chat('c-2', RoleEnum.ASSISTANT, 'luna', ['Welcome'], at(25, 10, 1), { modelId: 'qwen3' }),
        chat('c-3', RoleEnum.USER, 'aria', ['I step inside'], at(26)),
        chat('c-4', RoleEnum.ASSISTANT, 'luna', ['first try', 'It creaks open slowly'], at(26, 10, 1), { modelId: 'qwen3' }),
    ],
});

const eldoria = createAdventureHelper({
    id: 'adv-2',
    name: 'Shadows of Eldoria',
    createdAt: at(20),
    chat: [
        chat('c-5', RoleEnum.USER, 'bram', ['Hello'], at(24)),
        chat('c-6', RoleEnum.ASSISTANT, 'luna', ['Welcome traveler'], at(24, 10, 1), { modelId: 'llama4' }),
    ],
});

const empty = createAdventureHelper({ id: 'adv-3', name: 'Test campaign', createdAt: at(25, 0), chat: [] });

const characters = [createCharacterHelper({ id: 'aria', name: 'Aria' }), createCharacterHelper({ id: 'bram', name: 'Bram' })];

function summarize (now = at(26, 15)) {
    return new ActivitySummaryService(logger).summarize({ adventures: [eldoria, lostKingdom, empty], characters, now });
}

describe('ActivitySummaryService', () => {
    it('lists the adventures by their last activity, with the latest message of each', () => {
        expect(summarize().adventures).toEqual([
            { id: 'adv-1', name: 'The Lost Kingdom', createdAt: at(1), lastActivityAt: at(26, 10, 1), messageCount: 4, lastMessage: 'It creaks open slowly' },
            { id: 'adv-3', name: 'Test campaign', createdAt: at(25, 0), lastActivityAt: at(25, 0), messageCount: 0, lastMessage: undefined },
            { id: 'adv-2', name: 'Shadows of Eldoria', createdAt: at(20), lastActivityAt: at(24, 10, 1), messageCount: 2, lastMessage: 'Welcome traveler' },
        ]);
    });

    it('counts the lines written, the replies, the generated words and the rerolls', () => {
        expect(summarize().story).toEqual({ linesWritten: 3, repliesGenerated: 3, wordsGenerated: 7, rerolls: 1 });
    });

    it('counts the messages of each of the last seven days, oldest first', () => {
        const { dailyActivity } = summarize();

        expect(dailyActivity.map(day => day.date)).toEqual([at(20, 0), at(21, 0), at(22, 0), at(23, 0), at(24, 0), at(25, 0), at(26, 0)]);
        expect(dailyActivity.map(day => day.messageCount)).toEqual([0, 0, 0, 0, 2, 2, 2]);
    });

    it.each([
        ['today was played', at(26, 15), 3],
        ['today was not played yet', at(27, 9), 3],
        ['the last day played was two days ago', at(28, 9), 0],
    ])('counts the streak when %s', (_, now, streak) => {
        expect(summarize(now).streak).toBe(streak);
    });

    it('finds the most played adventure, the character with the most lines and the model with the most replies', () => {
        expect(summarize().highlights).toEqual({
            mostPlayed: { adventureId: 'adv-1', name: 'The Lost Kingdom', messageCount: 4 },
            hero: { characterId: 'aria', name: 'Aria', lineCount: 2 },
            topModel: { modelId: 'qwen3', replyCount: 2 },
        });
    });

    it('has no highlights, activity or streak before anything was played', () => {
        const summary = new ActivitySummaryService(logger).summarize({ adventures: [empty], characters, now: at(26) });

        expect(summary.highlights).toEqual({ mostPlayed: undefined, hero: undefined, topModel: undefined });
        expect(summary.streak).toBe(0);
        expect(summary.story).toEqual({ linesWritten: 0, repliesGenerated: 0, wordsGenerated: 0, rerolls: 0 });
    });

    it('ignores the lines of deleted characters and the replies without a recorded model', () => {
        const adventure = createAdventureHelper({
            chat: [
                chat('c-1', RoleEnum.USER, 'ghost', ['Boo'], at(26)),
                chat('c-2', RoleEnum.ASSISTANT, 'luna', ['A chill runs down your spine'], at(26)),
            ],
        });

        const { highlights } = new ActivitySummaryService(logger).summarize({ adventures: [adventure], characters, now: at(26) });

        expect(highlights.hero).toBeUndefined();
        expect(highlights.topModel).toBeUndefined();
    });

    it('counts no words for a reply whose selected version is missing', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ role: RoleEnum.ASSISTANT, content: ['only version'], index: 3, createdAt: at(26), updatedAt: at(26) })],
        });

        const summary = new ActivitySummaryService(logger).summarize({ adventures: [adventure], characters, now: at(26) });

        expect(summary.story.wordsGenerated).toBe(0);
        expect(summary.adventures[0].lastMessage).toBe('');
    });
});
