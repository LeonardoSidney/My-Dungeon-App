import {
    GetSystemPromptLoadOrderUseCase,
    ResetSystemPromptLoadOrderUseCase,
    SaveSystemPromptLoadOrderUseCase,
} from '@application/use-cases';
import { DEFAULT_TEXT_ADVENTURE_TEMPLATE } from '@domain/constants/textGeneration';
import { Settings } from '@domain/entities';
import { ILogger } from '@domain/logger';

const logger = {
    debug: jest.fn(),
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

describe('GetSystemPromptLoadOrderUseCase', () => {
    it('returns the saved load order', async () => {
        const repository = createRepository({ systemPromptLoadOrder: '{systemPrompt}{characters}' });

        const response = await new GetSystemPromptLoadOrderUseCase(logger, repository).execute();

        expect(response).toEqual({ success: true, loadOrder: '{systemPrompt}{characters}' });
    });

    it('falls back to the default load order when none was saved', async () => {
        const repository = createRepository();

        const response = await new GetSystemPromptLoadOrderUseCase(logger, repository).execute();

        expect(response).toEqual({ success: true, loadOrder: DEFAULT_TEXT_ADVENTURE_TEMPLATE });
    });

    it('keeps a saved empty load order instead of falling back to the default', async () => {
        const repository = createRepository({ systemPromptLoadOrder: '' });

        const response = await new GetSystemPromptLoadOrderUseCase(logger, repository).execute();

        expect(response).toEqual({ success: true, loadOrder: '' });
    });

    it.each([
        [{ success: false, error: 'Failed to load settings' }, 'Failed to load settings'],
        [{ success: false }, 'Failed to load settings'],
        [{ success: true }, 'Failed to load settings'],
    ])('fails when the repository answers %j', async (repositoryResponse, error) => {
        const repository = createRepository();
        repository.getSettings.mockResolvedValue(repositoryResponse);

        const response = await new GetSystemPromptLoadOrderUseCase(logger, repository).execute();

        expect(response).toEqual({ success: false, error });
    });
});

describe('SaveSystemPromptLoadOrderUseCase', () => {
    function createValidateService (loadOrder = '{systemPrompt}{characters}') {
        return { validate: jest.fn().mockReturnValue({ success: true, loadOrder }) };
    }

    function buildUseCase (repository = createRepository(), validateService = createValidateService()) {
        return new SaveSystemPromptLoadOrderUseCase(logger, repository, validateService);
    }

    it('saves the load order returned by the validation service and returns it', async () => {
        const repository = createRepository();
        const validateService = createValidateService('{systemPrompt}{characters}');

        const response = await buildUseCase(repository, validateService).execute({ loadOrder: ' {systemPrompt}\n{characters} ' });

        expect(validateService.validate).toHaveBeenCalledWith({ loadOrder: ' {systemPrompt}\n{characters} ' });
        expect(response).toEqual({ success: true, loadOrder: '{systemPrompt}{characters}' });
        expect(repository.saveSettings).toHaveBeenCalledWith({ settings: { systemPromptLoadOrder: '{systemPrompt}{characters}' } });
    });

    it('saves an empty load order', async () => {
        const repository = createRepository();

        const response = await buildUseCase(repository, createValidateService('')).execute({ loadOrder: '' });

        expect(response).toEqual({ success: true, loadOrder: '' });
        expect(repository.saveSettings).toHaveBeenCalledWith({ settings: { systemPromptLoadOrder: '' } });
    });

    it('replaces a previously saved load order', async () => {
        const repository = createRepository({ systemPromptLoadOrder: '{worlds}' });

        await buildUseCase(repository, createValidateService('{items}')).execute({ loadOrder: '{items}' });

        expect(repository.saveSettings).toHaveBeenCalledWith({ settings: { systemPromptLoadOrder: '{items}' } });
    });

    it.each([
        [{ success: false, error: 'Invalid tag: {abacate}' }, 'Invalid tag: {abacate}'],
        [{ success: false }, 'Invalid system prompt load order'],
        [{ success: true }, 'Invalid system prompt load order'],
    ])('fails without touching the storage when the validation answers %j', async (validation, error) => {
        const repository = createRepository();
        const validateService = { validate: jest.fn().mockReturnValue(validation) };

        const response = await buildUseCase(repository, validateService).execute({ loadOrder: '{abacate}' });

        expect(response).toEqual({ success: false, error });
        expect(repository.getSettings).not.toHaveBeenCalled();
        expect(repository.saveSettings).not.toHaveBeenCalled();
    });

    it('requires a load order', async () => {
        const repository = createRepository();
        const validateService = createValidateService();

        const response = await buildUseCase(repository, validateService).execute({ loadOrder: undefined as unknown as string });

        expect(response).toEqual({ success: false, error: 'System prompt load order is required' });
        expect(validateService.validate).not.toHaveBeenCalled();
        expect(repository.saveSettings).not.toHaveBeenCalled();
    });

    it.each([
        [{ success: false, error: 'Storage unavailable' }, 'Storage unavailable'],
        [{ success: false }, 'Failed to load settings'],
    ])('fails without saving when the settings load answers %j', async (loaded, error) => {
        const repository = createRepository();
        repository.getSettings.mockResolvedValue(loaded);

        const response = await buildUseCase(repository).execute({ loadOrder: '{items}' });

        expect(response).toEqual({ success: false, error });
        expect(repository.saveSettings).not.toHaveBeenCalled();
    });

    it('propagates a save failure', async () => {
        const repository = createRepository();
        repository.saveSettings.mockResolvedValue({ success: false, error: 'Failed to save settings' });

        const response = await buildUseCase(repository).execute({ loadOrder: '{items}' });

        expect(response).toEqual({ success: false, error: 'Failed to save settings' });
    });
});

describe('ResetSystemPromptLoadOrderUseCase', () => {
    it('erases the saved load order and returns the default one', async () => {
        const repository = createRepository({ systemPromptLoadOrder: '{systemPrompt}' });

        const response = await new ResetSystemPromptLoadOrderUseCase(logger, repository).execute();

        expect(response).toEqual({ success: true, loadOrder: DEFAULT_TEXT_ADVENTURE_TEMPLATE });
        expect(repository.saveSettings).toHaveBeenCalledWith({ settings: {} });
    });

    it('does not keep the erased key in the saved settings', async () => {
        const repository = createRepository({ systemPromptLoadOrder: '' });

        await new ResetSystemPromptLoadOrderUseCase(logger, repository).execute();

        const [{ settings }] = repository.saveSettings.mock.calls[0];
        expect(Object.keys(settings)).not.toContain('systemPromptLoadOrder');
    });

    it('fails without saving when the settings cannot be loaded', async () => {
        const repository = createRepository();
        repository.getSettings.mockResolvedValue({ success: false });

        const response = await new ResetSystemPromptLoadOrderUseCase(logger, repository).execute();

        expect(response).toEqual({ success: false, error: 'Failed to load settings' });
        expect(repository.saveSettings).not.toHaveBeenCalled();
    });

    it('propagates a save failure', async () => {
        const repository = createRepository();
        repository.saveSettings.mockResolvedValue({ success: false, error: 'Failed to save settings' });

        const response = await new ResetSystemPromptLoadOrderUseCase(logger, repository).execute();

        expect(response).toEqual({ success: false, error: 'Failed to save settings' });
    });
});
