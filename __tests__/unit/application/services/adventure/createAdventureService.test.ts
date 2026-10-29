import { CreateAdventureService } from '@application/services';
import { ILogger } from '@domain/logger';
import { createAdventureRequestHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const idGenerator = { generate: jest.fn().mockReturnValue('adv-1') };

describe('CreateAdventureService', () => {
    const service = new CreateAdventureService(logger, idGenerator);

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

    it('rejects a cast that breaks the character rules', () => {
        const response = service.createAdventure(createAdventureRequestHelper({
            playableCharacterIds: [],
            aiControlledCharacterIds: ['npc'],
        }));

        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
    });
});
