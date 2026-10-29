import { EditAdventureService } from '@application/services';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createAdventureRequestHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('EditAdventureService', () => {
    it('rebuilds the cast from the selection and keeps the chat', () => {
        const chat = createAdventureHelper().chat;
        const adventure = createAdventureHelper({ id: 'adv-1', chat });

        const response = new EditAdventureService(logger).editAdventure({
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

    it('rejects an edited cast that breaks the character rules', () => {
        const response = new EditAdventureService(logger).editAdventure({
            adventure: createAdventureHelper({ id: 'adv-1' }),
            editParams: createAdventureRequestHelper({ playableCharacterIds: [], aiControlledCharacterIds: ['npc'] }),
        });

        expect(response).toEqual({ success: false, error: 'You need at least 1 playable character' });
    });
});
