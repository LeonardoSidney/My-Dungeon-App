import { GetChatTemplatesUseCase, SaveChatTemplatesUseCase } from '@application/use-cases';
import { CHAT_TEMPLATE_DEFINITIONS, DEFAULT_TEXT_ADVENTURE_ITEMS_TEMPLATE, DEFAULT_TEXT_ADVENTURE_WORLDS_TEMPLATE } from '@domain/constants/textGeneration';
import { ChatTemplateOverrides, Settings } from '@domain/entities';
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

function createValidateService () {
    return { validate: jest.fn().mockReturnValue({ success: true }) };
}

describe('GetChatTemplatesUseCase', () => {
    it('returns the default of every template when none was saved', async () => {
        const response = await new GetChatTemplatesUseCase(logger, createRepository()).execute();

        expect(response.success).toBe(true);
        expect(response.templates?.worlds).toBe(DEFAULT_TEXT_ADVENTURE_WORLDS_TEMPLATE);
        expect(Object.keys(response.templates ?? {})).toHaveLength(18);
    });

    it('applies the saved overrides over the defaults', async () => {
        const repository = createRepository({ chatTemplates: { worlds: '# REALMS\n{worlds}' } });

        const response = await new GetChatTemplatesUseCase(logger, repository).execute();

        expect(response.templates?.worlds).toBe('# REALMS\n{worlds}');
        expect(response.templates?.items).toBe(DEFAULT_TEXT_ADVENTURE_ITEMS_TEMPLATE);
    });

    it('returns the definition of every template', async () => {
        const response = await new GetChatTemplatesUseCase(logger, createRepository()).execute();

        expect(response.definitions).toBe(CHAT_TEMPLATE_DEFINITIONS);
    });

    it('returns the repository error when the settings cannot be loaded', async () => {
        const repository = createRepository();
        repository.getSettings.mockResolvedValue({ success: false, error: 'Storage failure' });

        const response = await new GetChatTemplatesUseCase(logger, repository).execute();

        expect(response).toEqual({ success: false, error: 'Storage failure' });
    });

    it('uses a default error when the repository answers without settings', async () => {
        const repository = createRepository();
        repository.getSettings.mockResolvedValue({ success: true });

        const response = await new GetChatTemplatesUseCase(logger, repository).execute();

        expect(response).toEqual({ success: false, error: 'Failed to load settings' });
    });
});

describe('SaveChatTemplatesUseCase', () => {
    it('saves the edited template next to the other settings', async () => {
        const repository = createRepository({ systemPromptLoadOrder: '{worlds}', showThinkBlocks: false });

        const response = await new SaveChatTemplatesUseCase(logger, repository, createValidateService()).execute({ templates: { worlds: '# REALMS\n{worlds}' } });

        expect(response).toEqual({ success: true });
        expect(repository.saveSettings).toHaveBeenCalledWith({
            settings: { systemPromptLoadOrder: '{worlds}', showThinkBlocks: false, chatTemplates: { worlds: '# REALMS\n{worlds}' } }
        });
    });

    it('keeps the overrides of the templates it did not receive', async () => {
        const repository = createRepository({ chatTemplates: { items: '{items}' } });

        await new SaveChatTemplatesUseCase(logger, repository, createValidateService()).execute({ templates: { worlds: '{worlds}' } });

        expect(repository.saveSettings).toHaveBeenCalledWith({ settings: { chatTemplates: { items: '{items}', worlds: '{worlds}' } } });
    });

    it('removes the override of a template saved with its default text', async () => {
        const repository = createRepository({ chatTemplates: { items: '{items}', worlds: '{worlds}' } });

        await new SaveChatTemplatesUseCase(logger, repository, createValidateService()).execute({ templates: { worlds: DEFAULT_TEXT_ADVENTURE_WORLDS_TEMPLATE } });

        expect(repository.saveSettings).toHaveBeenCalledWith({ settings: { chatTemplates: { items: '{items}' } } });
    });

    it('removes the chat templates from the settings when no override is left', async () => {
        const repository = createRepository({ showThinkBlocks: true, chatTemplates: { worlds: '{worlds}' } });

        await new SaveChatTemplatesUseCase(logger, repository, createValidateService()).execute({ templates: { worlds: DEFAULT_TEXT_ADVENTURE_WORLDS_TEMPLATE } });

        expect(repository.saveSettings).toHaveBeenCalledWith({ settings: { showThinkBlocks: true } });
    });

    it('returns the field errors without saving when a template is invalid', async () => {
        const repository = createRepository();
        const validateService = createValidateService();
        validateService.validate.mockReturnValue({ success: false, fieldErrors: { worlds: 'Missing tag: {worlds}' } });

        const response = await new SaveChatTemplatesUseCase(logger, repository, validateService).execute({ templates: { worlds: 'text' } });

        expect(response).toEqual({ success: false, fieldErrors: { worlds: 'Missing tag: {worlds}' } });
        expect(repository.saveSettings).not.toHaveBeenCalled();
    });

    it('fails validation when no templates are given', async () => {
        const repository = createRepository();
        const params = {} as { templates: ChatTemplateOverrides };

        const response = await new SaveChatTemplatesUseCase(logger, repository, createValidateService()).execute(params);

        expect(response).toEqual({ success: false, error: 'Chat templates are required' });
        expect(repository.getSettings).not.toHaveBeenCalled();
    });

    it('returns the repository error when the settings cannot be loaded', async () => {
        const repository = createRepository();
        repository.getSettings.mockResolvedValue({ success: false, error: 'Storage failure' });

        const response = await new SaveChatTemplatesUseCase(logger, repository, createValidateService()).execute({ templates: { worlds: '{worlds}' } });

        expect(response).toEqual({ success: false, error: 'Storage failure' });
        expect(repository.saveSettings).not.toHaveBeenCalled();
    });

    it('uses a default error when the settings cannot be loaded without a message', async () => {
        const repository = createRepository();
        repository.getSettings.mockResolvedValue({ success: false });

        const response = await new SaveChatTemplatesUseCase(logger, repository, createValidateService()).execute({ templates: { worlds: '{worlds}' } });

        expect(response).toEqual({ success: false, error: 'Failed to load settings' });
        expect(repository.saveSettings).not.toHaveBeenCalled();
    });

    it('returns the repository error when the settings cannot be saved', async () => {
        const repository = createRepository();
        repository.saveSettings.mockResolvedValue({ success: false, error: 'Failed to save settings' });

        const response = await new SaveChatTemplatesUseCase(logger, repository, createValidateService()).execute({ templates: { worlds: '{worlds}' } });

        expect(response).toEqual({ success: false, error: 'Failed to save settings' });
    });
});
