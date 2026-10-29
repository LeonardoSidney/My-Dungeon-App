import { SettingsRepository } from '@infra/repository';
import { ILogger } from '@domain/logger';
import { IStorage } from '@domain/storage';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

function buildRepository (stored: unknown, loadSuccess = true) {
    const storage: IStorage = {
        load: jest.fn().mockResolvedValue(loadSuccess ? { success: true, data: stored } : { success: false, error: 'disk error' }),
        save: jest.fn().mockResolvedValue({ success: true })
    };
    return { repository: new SettingsRepository(mockLogger, storage), storage };
}

describe('SettingsRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns the stored settings', async () => {
        const { repository, storage } = buildRepository({ systemPromptLoadOrder: '{characters}' });

        const response = await repository.getSettings();

        expect(response).toEqual({ success: true, settings: { systemPromptLoadOrder: '{characters}' } });
        expect(storage.load).toHaveBeenCalledWith('@my_dungeon_app/settings');
    });

    it('returns a stored empty load order', async () => {
        const { repository } = buildRepository({ systemPromptLoadOrder: '' });

        const response = await repository.getSettings();

        expect(response).toEqual({ success: true, settings: { systemPromptLoadOrder: '' } });
    });

    it.each([null, undefined])('returns empty settings when nothing was saved (%s)', async (stored) => {
        const { repository } = buildRepository(stored);

        const response = await repository.getSettings();

        expect(response).toEqual({ success: true, settings: {} });
    });

    it.each([
        ['a list', []],
        ['a string', 'settings'],
        ['a load order that is not a string', { systemPromptLoadOrder: 42 }],
    ])('falls back to empty settings when the stored value is %s', async (_, stored) => {
        const { repository } = buildRepository(stored);

        const response = await repository.getSettings();

        expect(response).toEqual({ success: true, settings: {} });
        expect(mockLogger.warning).toHaveBeenCalled();
    });

    it('fails when the storage cannot be read', async () => {
        const { repository } = buildRepository(undefined, false);

        const response = await repository.getSettings();

        expect(response).toEqual({ success: false, error: 'Failed to load settings' });
    });

    it('writes the settings under the settings key', async () => {
        const { repository, storage } = buildRepository(undefined);

        const response = await repository.saveSettings({ settings: { systemPromptLoadOrder: '{items}' } });

        expect(response).toEqual({ success: true });
        expect(storage.save).toHaveBeenCalledWith('@my_dungeon_app/settings', { systemPromptLoadOrder: '{items}' });
    });

    it('fails when the storage cannot be written', async () => {
        const { repository, storage } = buildRepository(undefined);
        (storage.save as jest.Mock).mockResolvedValue({ success: false, error: 'disk full' });

        const response = await repository.saveSettings({ settings: {} });

        expect(response).toEqual({ success: false, error: 'Failed to save settings' });
    });
});
