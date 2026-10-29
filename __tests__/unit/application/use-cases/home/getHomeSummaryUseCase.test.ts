import { GetHomeSummaryUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createCharacterHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const ACTIVITY = { adventures: [], story: { linesWritten: 0, repliesGenerated: 0, wordsGenerated: 0, rerolls: 0 }, dailyActivity: [], streak: 0, highlights: {} };

const listOf = (key: string, length: number) => ({ execute: jest.fn().mockResolvedValue({ success: true, [key]: Array.from({ length }, (_, index) => ({ id: `${key}-${index}` })) }) });

function buildUseCase () {
    const adventures = [createAdventureHelper({ id: 'adv-1' })];
    const characters = [createCharacterHelper({ id: 'aria' })];
    const mocks = {
        getAdventures: { execute: jest.fn().mockResolvedValue({ success: true, adventures }) },
        getCharacters: { execute: jest.fn().mockResolvedValue({ success: true, characters }) },
        getWorldMasters: listOf('worldMasters', 2),
        getWorlds: listOf('worlds', 3),
        getLocations: listOf('locations', 4),
        getItems: listOf('items', 5),
        getAbilities: listOf('abilities', 6),
        getProficiencies: listOf('proficiencies', 7),
        getStatuses: listOf('statuses', 8),
        getSystemPrompts: listOf('systemPrompts', 9),
        getAssistants: listOf('assistants', 10),
        getSamplers: listOf('samplers', 11),
        getConnections: listOf('connections', 12),
        activitySummary: { summarize: jest.fn().mockReturnValue(ACTIVITY) },
    };
    const useCase = new GetHomeSummaryUseCase(
        logger,
        mocks.getAdventures,
        mocks.getCharacters,
        mocks.getWorldMasters,
        mocks.getWorlds,
        mocks.getLocations,
        mocks.getItems,
        mocks.getAbilities,
        mocks.getProficiencies,
        mocks.getStatuses,
        mocks.getSystemPrompts,
        mocks.getAssistants,
        mocks.getSamplers,
        mocks.getConnections,
        mocks.activitySummary
    );
    return { useCase, mocks, adventures, characters };
}

describe('GetHomeSummaryUseCase', () => {
    it('counts every catalog list and summarizes the activity of the adventures', async () => {
        const { useCase, mocks, adventures, characters } = buildUseCase();
        const now = new Date(2026, 9, 26);

        const response = await useCase.execute({ now });

        expect(response).toEqual({
            success: true,
            summary: {
                counts: {
                    adventures: 1,
                    characters: 1,
                    worldMasters: 2,
                    worlds: 3,
                    locations: 4,
                    items: 5,
                    abilities: 6,
                    proficiencies: 7,
                    statuses: 8,
                    systemPrompts: 9,
                    assistants: 10,
                    samplers: 11,
                    connections: 12,
                },
                activity: ACTIVITY,
            },
        });
        expect(mocks.activitySummary.summarize).toHaveBeenCalledWith({ adventures, characters, now });
    });

    it('summarizes the activity up to the current date when none is given', async () => {
        const { useCase, mocks } = buildUseCase();

        await useCase.execute();

        expect(mocks.activitySummary.summarize).toHaveBeenCalledWith(expect.objectContaining({ now: expect.any(Date) }));
    });

    it('counts zero for the lists that come back without items', async () => {
        const { useCase, mocks } = buildUseCase();
        const { activitySummary, ...lists } = mocks;
        Object.values(lists).forEach(list => list.execute.mockResolvedValue({ success: true }));

        const response = await useCase.execute();

        expect(Object.values(response.summary?.counts ?? {})).toEqual(Array(13).fill(0));
        expect(activitySummary.summarize).toHaveBeenCalledWith(expect.objectContaining({ adventures: [], characters: [] }));
    });

    it.each([
        [{ success: false, error: 'Storage unavailable' }, 'Storage unavailable'],
        [{ success: false }, 'Failed to load the home summary'],
    ])('fails without summarizing when a list answers %j', async (failure, error) => {
        const { useCase, mocks } = buildUseCase();
        mocks.getSamplers.execute.mockResolvedValue(failure);

        const response = await useCase.execute();

        expect(response).toEqual({ success: false, error });
        expect(mocks.activitySummary.summarize).not.toHaveBeenCalled();
    });

    it('fails without loading anything when the date is invalid', async () => {
        const { useCase, mocks } = buildUseCase();

        const response = await useCase.execute({ now: new Date('not a date') });

        expect(response).toEqual({ success: false, error: 'A valid date is required to summarize the activity' });
        expect(mocks.getAdventures.execute).not.toHaveBeenCalled();
    });
});
