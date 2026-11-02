import { EditAdventureService } from '@application/services';
import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditAdventureServiceParams } from '@domain/services';
import { createAdventureHelper, createAdventureRequestHelper, createChatHelper } from '@test/helpers';

const CREATED_AT = '2026-01-10T08:00:00.000Z';
const PREVIOUS_UPDATED_AT = '2026-02-20T09:30:00.000Z';
const NOW = '2026-06-15T12:00:00.000Z';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

function createStoredAdventure (overrides?: Partial<Adventure>): Adventure {
    return createAdventureHelper({
        id: 'adv-1',
        name: 'Old Quest',
        chat: [createChatHelper()],
        characterIds: ['old-hero'],
        worldMasterId: 'old-master',
        charactersControlledByAi: [],
        systemPromptIds: ['old-prompt'],
        worldIds: ['old-world'],
        locationIds: ['old-location'],
        itemIds: ['old-item'],
        createdAt: new Date(CREATED_AT),
        updatedAt: new Date(PREVIOUS_UPDATED_AT),
        ...overrides
    });
}

function createEditParams (): Required<EditAdventureServiceParams['editParams']> {
    return {
        name: 'The Quest',
        systemPromptIds: ['prompt'],
        playableCharacterIds: ['hero'],
        aiControlledCharacterIds: ['npc'],
        characterAsWorldMasterId: 'narrator',
        worldMasterId: 'master',
        worldIds: ['world'],
        locationIds: ['location'],
        itemIds: ['item'],
    };
}

describe('EditAdventureService', () => {
    const service = new EditAdventureService(logger);

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('logs the execution once', () => {
        service.editAdventure({ adventure: createStoredAdventure(), editParams: createEditParams() });

        expect(logger.info).toHaveBeenCalledTimes(1);
        expect(logger.info).toHaveBeenCalledWith('Executing EditAdventureService::editAdventure');
    });

    it('returns only success and the edited adventure with every entity field', () => {
        const response = service.editAdventure({ adventure: createStoredAdventure(), editParams: createEditParams() });

        expect(response).toStrictEqual({
            success: true,
            adventure: {
                id: 'adv-1',
                name: 'The Quest',
                chat: [createChatHelper()],
                systemPromptIds: ['prompt'],
                characterIds: ['hero', 'npc', 'narrator'],
                worldMasterId: 'master',
                characterAsWorldMasterId: 'narrator',
                charactersControlledByAi: ['npc'],
                worldIds: ['world'],
                locationIds: ['location'],
                itemIds: ['item'],
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(NOW),
            },
        });
    });

    it('rebuilds the cast from the selection and keeps the chat', () => {
        const chat = [createChatHelper()];
        const adventure = createStoredAdventure({ chat });

        const response = service.editAdventure({
            adventure,
            editParams: createAdventureRequestHelper({ playableCharacterIds: ['hero'], aiControlledCharacterIds: ['npc'] }),
        });

        expect(response.adventure).toEqual(expect.objectContaining({
            id: 'adv-1',
            chat,
            characterIds: ['hero', 'npc'],
            charactersControlledByAi: ['npc'],
        }));
        expect(response.adventure).not.toHaveProperty('playableCharacterIds');
    });

    it('clears the character acting as world master when the edit picks a dedicated world master', () => {
        const response = service.editAdventure({
            adventure: createStoredAdventure({ worldMasterId: undefined, characterAsWorldMasterId: 'narrator', characterIds: ['hero', 'narrator'] }),
            editParams: createAdventureRequestHelper({ playableCharacterIds: ['hero'], worldMasterId: 'master', characterAsWorldMasterId: undefined }),
        });

        expect(response.adventure?.characterAsWorldMasterId).toBeUndefined();
        expect(response.adventure).toEqual(expect.objectContaining({ worldMasterId: 'master', characterIds: ['hero'] }));
    });

    it('clears the dedicated world master when the edit picks a character acting as world master', () => {
        const response = service.editAdventure({
            adventure: createStoredAdventure({ worldMasterId: 'old-master' }),
            editParams: createAdventureRequestHelper({ playableCharacterIds: ['hero'], worldMasterId: undefined, characterAsWorldMasterId: 'narrator' }),
        });

        expect(response.adventure?.worldMasterId).toBeUndefined();
        expect(response.adventure).toEqual(expect.objectContaining({ characterAsWorldMasterId: 'narrator', characterIds: ['hero', 'narrator'] }));
    });

    it('leaves the judgement of the cast to the use case', () => {
        const response = service.editAdventure({
            adventure: createStoredAdventure(),
            editParams: createAdventureRequestHelper({ playableCharacterIds: [], aiControlledCharacterIds: ['npc'] }),
        });

        expect(response.success).toBe(true);
        expect(response.adventure?.characterIds).toEqual(['npc']);
    });

    it('trims the start and the end of the name', () => {
        const response = service.editAdventure({
            adventure: createStoredAdventure(),
            editParams: createAdventureRequestHelper({ name: '  The  Quest\n' }),
        });

        expect(response.adventure?.name).toBe('The  Quest');
    });

    it('reduces a name made only of whitespace to an empty string', () => {
        const response = service.editAdventure({
            adventure: createStoredAdventure(),
            editParams: createAdventureRequestHelper({ name: ' \t\n ' }),
        });

        expect(response.adventure?.name).toBe('');
    });

    it('does not mutate the given adventure', () => {
        const adventure = createStoredAdventure();

        service.editAdventure({ adventure, editParams: createEditParams() });

        expect(adventure).toStrictEqual(createStoredAdventure());
    });

    it('does not mutate the given editParams', () => {
        const editParams = createEditParams();

        service.editAdventure({ adventure: createStoredAdventure(), editParams });

        expect(editParams).toStrictEqual(createEditParams());
    });
});
