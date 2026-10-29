import { GetAdventureCharactersController, GetAdventureSummaryController, GetAdventureWorldMasterController, SetAdventureWorldMasterController } from '@adapters/controllers';
import { GetAdventureCharactersPresenter, GetAdventureSummaryPresenter, GetAdventureWorldMasterPresenter } from '@adapters/presenters';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createCharacterHelper, createWorldMasterHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('GetAdventureSummaryController', () => {
    it('looks the adventure up by id and returns only its id and name', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, adventure: createAdventureHelper({ id: 'adv-1', name: 'Quest' }) });

        const response = await new GetAdventureSummaryController(logger, { execute }, new GetAdventureSummaryPresenter()).handle({ adventureId: 'adv-1' });

        expect(execute).toHaveBeenCalledWith({ id: 'adv-1' });
        expect(response).toEqual({ success: true, data: { id: 'adv-1', name: 'Quest' }, error: undefined });
    });

    it('forwards the not found error', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'Adventure with id adv-1 not found' });

        const response = await new GetAdventureSummaryController(logger, { execute }, new GetAdventureSummaryPresenter()).handle({ adventureId: 'adv-1' });

        expect(response).toEqual({ success: false, data: undefined, error: 'Adventure with id adv-1 not found' });
    });
});

describe('GetAdventureCharactersController', () => {
    it('returns the characters of the adventure with only ids and names', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, characters: [createCharacterHelper({ id: 'hero', name: 'Hero' })] });

        const response = await new GetAdventureCharactersController(logger, { execute }, new GetAdventureCharactersPresenter()).handle({ adventureId: 'adv-1' });

        expect(execute).toHaveBeenCalledWith({ adventureId: 'adv-1' });
        expect(response).toEqual({ success: true, items: [{ id: 'hero', name: 'Hero' }], error: undefined });
    });
});

describe('GetAdventureWorldMasterController', () => {
    it('returns the world master with only id and name', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, worldMaster: createWorldMasterHelper({ id: 'wm', name: 'Narrator' }) });

        const response = await new GetAdventureWorldMasterController(logger, { execute }, new GetAdventureWorldMasterPresenter()).handle({ adventureId: 'adv-1' });

        expect(response).toEqual({ success: true, data: { id: 'wm', name: 'Narrator' } });
    });

    it('answers null, not an error, when the adventure has no world master', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true });

        const response = await new GetAdventureWorldMasterController(logger, { execute }, new GetAdventureWorldMasterPresenter()).handle({ adventureId: 'adv-1' });

        expect(response).toEqual({ success: true, data: null });
    });

    it('forwards the use case error', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'World master with id wm not found' });

        const response = await new GetAdventureWorldMasterController(logger, { execute }, new GetAdventureWorldMasterPresenter()).handle({ adventureId: 'adv-1' });

        expect(response).toEqual({ success: false, error: 'World master with id wm not found' });
    });
});

describe('SetAdventureWorldMasterController', () => {
    it('only acknowledges the command', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true });

        const response = await new SetAdventureWorldMasterController(logger, { execute }).handle({ adventureId: 'adv-1', worldMasterId: 'wm' });

        expect(response).toEqual({ success: true, error: undefined });
    });
});
