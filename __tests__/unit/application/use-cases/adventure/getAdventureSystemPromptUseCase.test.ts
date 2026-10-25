import { GetAdventureSystemPromptUseCase } from '@application/use-cases';
import { ITextGeneration } from '@domain/providers';
import { IHydrateAdventureUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createHydratedAdventureHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockHydrateAdventureUseCase = {
    execute: jest.fn()
};

const mockTextGeneration = {
    buildAdventureTextSystemPrompt: jest.fn()
};

const adventure = createAdventureHelper();

function buildUseCase (): GetAdventureSystemPromptUseCase {
    return new GetAdventureSystemPromptUseCase(
        mockLogger,
        mockTextGeneration as unknown as ITextGeneration,
        mockHydrateAdventureUseCase as unknown as IHydrateAdventureUseCase
    );
}

describe('GetAdventureSystemPromptUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockHydrateAdventureUseCase.execute.mockResolvedValue({ success: true, hydrated: createHydratedAdventureHelper({ adventure }) });
    });

    it('should return the system prompt composed from the adventure hydrated by id', async () => {
        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue({ success: true, systemPrompt: '# WORLD MASTER\nprompt here' });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: true, systemPrompt: '# WORLD MASTER\nprompt here' });
        expect(mockHydrateAdventureUseCase.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1' });
        expect(mockTextGeneration.buildAdventureTextSystemPrompt).toHaveBeenCalledTimes(1);
    });

    it('should return the hydration error without building the system prompt', async () => {
        mockHydrateAdventureUseCase.execute.mockResolvedValue({ success: false, error: 'Adventure with id adventure-1 not found' });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Adventure with id adventure-1 not found' });
        expect(mockTextGeneration.buildAdventureTextSystemPrompt).not.toHaveBeenCalled();
    });

    it.each([
        [{ success: false }],
        [{ success: true }]
    ])('should fail with a generic error when hydration answers %j', async (hydrateResponse) => {
        mockHydrateAdventureUseCase.execute.mockResolvedValue(hydrateResponse);

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Failed to hydrate adventure' });
    });

    it('should fail with the provider error when the system prompt cannot be built', async () => {
        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue({ success: false, error: 'Template failure' });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Template failure' });
        expect(mockLogger.warning).toHaveBeenCalled();
    });

    it('should fail when the provider succeeds without a system prompt', async () => {
        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response.success).toBe(false);
    });

    it('should fail when the composed system prompt is empty', async () => {
        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue({ success: true, systemPrompt: '   ' });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'System prompt is empty' });
    });
});
