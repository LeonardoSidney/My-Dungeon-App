import { CreateAdventureService } from '@application/services';
import { ILogger } from '@domain/logger';
import { CreateAdventureServiceParams } from '@domain/services';
import { createAdventureRequestHelper } from '@test/helpers';

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

const idGenerator = { generate: jest.fn() };

function createParams (): Required<CreateAdventureServiceParams> {
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

describe('CreateAdventureService', () => {
    const service = new CreateAdventureService(logger, idGenerator);

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        idGenerator.generate.mockReturnValue('adv-1');
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('logs the execution once', () => {
        service.createAdventure(createParams());

        expect(logger.info).toHaveBeenCalledTimes(1);
    });

    it('generates the id once', () => {
        service.createAdventure(createParams());

        expect(idGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('returns only success and the created adventure with every entity field', () => {
        const response = service.createAdventure(createParams());

        expect(response).toStrictEqual({
            success: true,
            adventure: {
                id: 'adv-1',
                name: 'The Quest',
                chat: [],
                systemPromptIds: ['prompt'],
                characterIds: ['hero', 'npc', 'narrator'],
                worldMasterId: 'master',
                characterAsWorldMasterId: 'narrator',
                charactersControlledByAi: ['npc'],
                worldIds: ['world'],
                locationIds: ['location'],
                itemIds: ['item'],
                createdAt: new Date(NOW),
                updatedAt: new Date(NOW),
            },
        });
    });

    it('uses the same Date instance for createdAt and updatedAt', () => {
        const response = service.createAdventure(createParams());

        expect(response.adventure?.createdAt).toBeInstanceOf(Date);
        expect(response.adventure?.updatedAt).toBe(response.adventure?.createdAt);
    });

    it('joins playable, AI controlled and world master characters into the cast', () => {
        const response = service.createAdventure(createAdventureRequestHelper({
            playableCharacterIds: ['hero', 'ally'],
            aiControlledCharacterIds: ['npc'],
            characterAsWorldMasterId: 'narrator',
            worldMasterId: undefined,
        }));

        expect(response.adventure).toEqual(expect.objectContaining({
            characterIds: ['hero', 'ally', 'npc', 'narrator'],
            charactersControlledByAi: ['npc'],
            characterAsWorldMasterId: 'narrator',
        }));
    });

    it('does not repeat a character listed in more than one role', () => {
        const response = service.createAdventure(createAdventureRequestHelper({
            playableCharacterIds: ['hero', 'npc'],
            aiControlledCharacterIds: ['npc'],
        }));

        expect(response.adventure?.characterIds).toEqual(['hero', 'npc']);
    });

    it('leaves the judgement of the cast to the use case', () => {
        const response = service.createAdventure(createAdventureRequestHelper({
            playableCharacterIds: [],
            aiControlledCharacterIds: ['npc'],
        }));

        expect(response.success).toBe(true);
        expect(response.adventure?.characterIds).toEqual(['npc']);
    });

    it('trims the start and the end of the name', () => {
        const response = service.createAdventure(createAdventureRequestHelper({ name: '  The  Quest\n' }));

        expect(response.adventure?.name).toBe('The  Quest');
    });

    it('reduces a name made only of whitespace to an empty string', () => {
        const response = service.createAdventure(createAdventureRequestHelper({ name: ' \t\n ' }));

        expect(response.adventure?.name).toBe('');
    });

    it('does not mutate the given params', () => {
        const params = createParams();

        service.createAdventure(params);

        expect(params).toStrictEqual(createParams());
    });
});
