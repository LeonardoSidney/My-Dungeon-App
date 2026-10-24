import {
    CreateAdventureController,
    EditAdventureController,
    GetAdventureController,
    GetAdventuresController,
} from '@adapters/controllers';
import { GetAdventurePresenter, GetAdventuresPresenter } from '@adapters/presenters';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createAdventureRequestHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const REQUEST = createAdventureRequestHelper({
    playableCharacterIds: ['hero'],
    aiControlledCharacterIds: ['npc'],
    characterAsWorldMasterId: 'narrator',
    worldMasterId: undefined,
});

describe('adventure write controllers', () => {
    it('forwards the create request as the client sent it', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, id: 'adv-1' });

        const response = await new CreateAdventureController(logger, { execute }).handle(REQUEST);

        expect(execute).toHaveBeenCalledWith(REQUEST);
        expect(response).toEqual({ success: true, id: 'adv-1', error: undefined });
    });

    it('forwards the edit request as the client sent it', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, id: 'adv-1' });

        const response = await new EditAdventureController(logger, { execute }).handle({ id: 'adv-1', editParams: REQUEST });

        expect(execute).toHaveBeenCalledWith({ id: 'adv-1', editParams: REQUEST });
        expect(response.id).toBe('adv-1');
    });

    it('forwards validation errors from the backend rules', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'You need at least 1 playable character' });

        const response = await new CreateAdventureController(logger, { execute }).handle(REQUEST);

        expect(response).toEqual({ success: false, id: undefined, error: 'You need at least 1 playable character' });
    });
});

describe('adventure read controllers', () => {
    it('lists adventures with only id, name and creation date', async () => {
        const createdAt = new Date('2026-01-02T03:04:05.000Z');
        const execute = jest.fn().mockResolvedValue({ success: true, adventures: [createAdventureHelper({ id: 'adv-1', name: 'Quest', createdAt })] });

        const response = await new GetAdventuresController(logger, { execute }, new GetAdventuresPresenter()).handle();

        expect(response).toEqual({ success: true, items: [{ id: 'adv-1', name: 'Quest', createdAt: createdAt.toISOString() }], error: undefined });
    });

    it('returns the form details with the roster already split', async () => {
        const adventure = createAdventureHelper({
            id: 'adv-1',
            characterIds: ['hero', 'npc', 'narrator'],
            charactersControlledByAi: ['npc'],
            characterAsWorldMasterId: 'narrator',
            worldMasterId: undefined,
        });
        const execute = jest.fn().mockResolvedValue({ success: true, adventure });

        const response = await new GetAdventureController(logger, { execute }, new GetAdventurePresenter()).handle({ id: 'adv-1' });

        expect(response.data).toEqual(expect.objectContaining({
            playableCharacterIds: ['hero'],
            aiControlledCharacterIds: ['npc'],
            characterAsWorldMasterId: 'narrator',
        }));
        expect(response.data).not.toHaveProperty('chat');
        expect(response.data).not.toHaveProperty('characterIds');
    });
});
