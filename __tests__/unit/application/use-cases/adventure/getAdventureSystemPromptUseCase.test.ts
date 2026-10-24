import { GetAdventureSystemPromptUseCase } from '@application/use-cases';
import { ITextGeneration } from '@domain/providers';
import { IHydrateAdventureService } from '@domain/services';
import { IAdventureRepository } from '@domain/repository';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createHydratedAdventureHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockHydrateAdventureService = {
    hydrate: jest.fn()
};

const mockTextGeneration = {
    buildAdventureTextSystemPrompt: jest.fn()
};

const mockAdventureRepository = {
    getAdventureById: jest.fn()
};

const adventure = createAdventureHelper();

function buildUseCase (): GetAdventureSystemPromptUseCase {
    return new GetAdventureSystemPromptUseCase(
        mockLogger,
        mockTextGeneration as unknown as ITextGeneration,
        mockHydrateAdventureService as unknown as IHydrateAdventureService,
        mockAdventureRepository as unknown as IAdventureRepository
    );
}

describe('GetAdventureSystemPromptUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure });
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true, hydrated: createHydratedAdventureHelper({ adventure }) });
    });

    it('should return the system prompt composed from the adventure loaded by id', async () => {
        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue({ success: true, systemPrompt: '# WORLD MASTER\nprompt here' });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: true, systemPrompt: '# WORLD MASTER\nprompt here' });
        expect(mockAdventureRepository.getAdventureById).toHaveBeenCalledWith('adventure-1');
        expect(mockHydrateAdventureService.hydrate).toHaveBeenCalledWith({ adventure });
        expect(mockTextGeneration.buildAdventureTextSystemPrompt).toHaveBeenCalledTimes(1);
    });

    it('should fail when the adventure id is blank', async () => {
        const response = await buildUseCase().execute({ adventureId: '  ' });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(mockAdventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('should return the repository error when loading fails', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: false, error: 'Database error' });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
    });

    it('should fail when the repository does not find the adventure', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: undefined });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Adventure with id adventure-1 not found' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
    });

    it('should fail when hydration fails', async () => {
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: false, error: 'Some characters were not found' });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Some characters were not found' });
        expect(mockTextGeneration.buildAdventureTextSystemPrompt).not.toHaveBeenCalled();
    });

    it.each([
        [{ success: false }],
        [{ success: true }]
    ])('should fail with a generic error when hydration answers %j', async (hydrateResponse) => {
        mockHydrateAdventureService.hydrate.mockResolvedValue(hydrateResponse);

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
