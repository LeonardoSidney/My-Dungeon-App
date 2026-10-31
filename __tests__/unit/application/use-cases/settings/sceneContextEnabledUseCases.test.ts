import { GetSceneContextEnabledUseCase, SaveSceneContextEnabledUseCase } from '@application/use-cases';
import { Settings } from '@domain/entities';
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

function createRepository (settings: Settings = {}) {
    return {
        getSettings: jest.fn().mockResolvedValue({ success: true, settings }),
        saveSettings: jest.fn().mockResolvedValue({ success: true })
    };
}

describe('GetSceneContextEnabledUseCase', () => {
    it('returns the saved setting', async () => {
        const repository = createRepository({ sceneContextEnabled: true });

        const response = await new GetSceneContextEnabledUseCase(logger, repository).execute();

        expect(response).toEqual({ success: true, sceneContextEnabled: true });
    });

    it('keeps the scene context off when no setting was saved', async () => {
        const repository = createRepository();

        const response = await new GetSceneContextEnabledUseCase(logger, repository).execute();

        expect(response).toEqual({ success: true, sceneContextEnabled: false });
    });

    it('propagates the repository error', async () => {
        const repository = createRepository();
        repository.getSettings.mockResolvedValue({ success: false, error: 'Storage unavailable' });

        const response = await new GetSceneContextEnabledUseCase(logger, repository).execute();

        expect(response).toEqual({ success: false, error: 'Storage unavailable' });
    });

    it('fails with the default error when the repository returns no settings', async () => {
        const repository = createRepository();
        repository.getSettings.mockResolvedValue({ success: true });

        const response = await new GetSceneContextEnabledUseCase(logger, repository).execute();

        expect(response).toEqual({ success: false, error: 'Failed to load settings' });
    });
});

describe('SaveSceneContextEnabledUseCase', () => {
    it('saves the setting and returns it', async () => {
        const repository = createRepository();

        const response = await new SaveSceneContextEnabledUseCase(logger, repository).execute({ sceneContextEnabled: false });

        expect(response).toEqual({ success: true, sceneContextEnabled: false });
        expect(repository.saveSettings).toHaveBeenCalledWith({ settings: { sceneContextEnabled: false } });
    });

    it('keeps the other saved settings', async () => {
        const repository = createRepository({ systemPromptLoadOrder: '{characters}', showThinkBlocks: false });

        await new SaveSceneContextEnabledUseCase(logger, repository).execute({ sceneContextEnabled: false });

        expect(repository.saveSettings).toHaveBeenCalledWith({
            settings: { systemPromptLoadOrder: '{characters}', showThinkBlocks: false, sceneContextEnabled: false }
        });
    });

    it('requires a boolean setting', async () => {
        const repository = createRepository();

        const response = await new SaveSceneContextEnabledUseCase(logger, repository).execute({ sceneContextEnabled: 'false' as unknown as boolean });

        expect(response).toEqual({ success: false, error: 'Scene context setting is required' });
        expect(repository.getSettings).not.toHaveBeenCalled();
        expect(repository.saveSettings).not.toHaveBeenCalled();
    });

    it('fails without saving when the settings cannot be loaded', async () => {
        const repository = createRepository();
        repository.getSettings.mockResolvedValue({ success: false });

        const response = await new SaveSceneContextEnabledUseCase(logger, repository).execute({ sceneContextEnabled: false });

        expect(response).toEqual({ success: false, error: 'Failed to load settings' });
        expect(repository.saveSettings).not.toHaveBeenCalled();
    });

    it('propagates a save failure', async () => {
        const repository = createRepository();
        repository.saveSettings.mockResolvedValue({ success: false, error: 'Failed to save settings' });

        const response = await new SaveSceneContextEnabledUseCase(logger, repository).execute({ sceneContextEnabled: false });

        expect(response).toEqual({ success: false, error: 'Failed to save settings' });
    });
});
