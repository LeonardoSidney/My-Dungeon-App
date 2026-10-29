import { GetThinkBlocksVisibilityUseCase, SaveThinkBlocksVisibilityUseCase } from '@application/use-cases';
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

describe('GetThinkBlocksVisibilityUseCase', () => {
    it('returns the saved visibility', async () => {
        const repository = createRepository({ showThinkBlocks: false });

        const response = await new GetThinkBlocksVisibilityUseCase(logger, repository).execute();

        expect(response).toEqual({ success: true, showThinkBlocks: false });
    });

    it('shows the think blocks when no visibility was saved', async () => {
        const repository = createRepository();

        const response = await new GetThinkBlocksVisibilityUseCase(logger, repository).execute();

        expect(response).toEqual({ success: true, showThinkBlocks: true });
    });

    it('propagates the repository error', async () => {
        const repository = createRepository();
        repository.getSettings.mockResolvedValue({ success: false, error: 'Storage unavailable' });

        const response = await new GetThinkBlocksVisibilityUseCase(logger, repository).execute();

        expect(response).toEqual({ success: false, error: 'Storage unavailable' });
    });

    it('fails with the default error when the repository returns no settings', async () => {
        const repository = createRepository();
        repository.getSettings.mockResolvedValue({ success: true });

        const response = await new GetThinkBlocksVisibilityUseCase(logger, repository).execute();

        expect(response).toEqual({ success: false, error: 'Failed to load settings' });
    });
});

describe('SaveThinkBlocksVisibilityUseCase', () => {
    it('saves the visibility and returns it', async () => {
        const repository = createRepository();

        const response = await new SaveThinkBlocksVisibilityUseCase(logger, repository).execute({ showThinkBlocks: false });

        expect(response).toEqual({ success: true, showThinkBlocks: false });
        expect(repository.saveSettings).toHaveBeenCalledWith({ settings: { showThinkBlocks: false } });
    });

    it('keeps the other saved settings', async () => {
        const repository = createRepository({ systemPromptLoadOrder: '{characters}', showThinkBlocks: false });

        await new SaveThinkBlocksVisibilityUseCase(logger, repository).execute({ showThinkBlocks: true });

        expect(repository.saveSettings).toHaveBeenCalledWith({ settings: { systemPromptLoadOrder: '{characters}', showThinkBlocks: true } });
    });

    it('requires a boolean visibility', async () => {
        const repository = createRepository();

        const response = await new SaveThinkBlocksVisibilityUseCase(logger, repository).execute({ showThinkBlocks: 'false' as unknown as boolean });

        expect(response).toEqual({ success: false, error: 'Think blocks visibility is required' });
        expect(repository.getSettings).not.toHaveBeenCalled();
        expect(repository.saveSettings).not.toHaveBeenCalled();
    });

    it('fails without saving when the settings cannot be loaded', async () => {
        const repository = createRepository();
        repository.getSettings.mockResolvedValue({ success: false });

        const response = await new SaveThinkBlocksVisibilityUseCase(logger, repository).execute({ showThinkBlocks: false });

        expect(response).toEqual({ success: false, error: 'Failed to load settings' });
        expect(repository.saveSettings).not.toHaveBeenCalled();
    });

    it('propagates a save failure', async () => {
        const repository = createRepository();
        repository.saveSettings.mockResolvedValue({ success: false, error: 'Failed to save settings' });

        const response = await new SaveThinkBlocksVisibilityUseCase(logger, repository).execute({ showThinkBlocks: false });

        expect(response).toEqual({ success: false, error: 'Failed to save settings' });
    });
});
