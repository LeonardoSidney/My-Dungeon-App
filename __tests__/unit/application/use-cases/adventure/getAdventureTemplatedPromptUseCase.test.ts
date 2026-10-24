import { GetAdventureTemplatedPromptUseCase } from '@application/use-cases';
import { ITextGeneration } from '@domain/providers';
import { IModelProviderGateway } from '@domain/gateways';
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

const mockGateway = {
    applyTemplate: jest.fn()
};

const mockAdventureRepository = {
    getAdventureById: jest.fn()
};

function buildUseCase (): GetAdventureTemplatedPromptUseCase {
    return new GetAdventureTemplatedPromptUseCase(
        mockLogger,
        mockTextGeneration as unknown as ITextGeneration,
        mockGateway as unknown as IModelProviderGateway,
        mockHydrateAdventureService as unknown as IHydrateAdventureService,
        mockAdventureRepository as unknown as IAdventureRepository
    );
}

describe('GetAdventureTemplatedPromptUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('reuses the provided hydrated adventure without loading or hydrating it', async () => {
        const adventure = createAdventureHelper();
        const hydrated = createHydratedAdventureHelper({ adventure });

        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue({ success: true, systemPrompt: 'system prompt' });
        mockGateway.applyTemplate.mockResolvedValue({ success: true, prompt: 'final prompt' });

        const response = await buildUseCase().execute({ hydrated });

        expect(response).toEqual({ success: true, prompt: 'final prompt' });
        expect(mockAdventureRepository.getAdventureById).not.toHaveBeenCalled();
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
        expect(mockTextGeneration.buildAdventureTextSystemPrompt).toHaveBeenCalledWith(hydrated);
        expect(mockGateway.applyTemplate).toHaveBeenCalledWith({
            connection: expect.objectContaining({ id: '1' }),
            modelId: '1',
            systemPrompt: 'system prompt',
            chat: adventure.chat
        });
    });

    it('fails when the adventure loaded by id cannot be hydrated', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper() });
        mockHydrateAdventureService.hydrate.mockResolvedValue({
            success: false,
            error: 'Some characters were not found'
        });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({
            success: false,
            error: 'Failed to hydrate adventure'
        });
        expect(mockTextGeneration.buildAdventureTextSystemPrompt).not.toHaveBeenCalled();
        expect(mockGateway.applyTemplate).not.toHaveBeenCalled();
    });

    it('fails when the gateway does not return a prompt', async () => {
        const adventure = createAdventureHelper();
        const hydrated = createHydratedAdventureHelper({ adventure });

        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue({ success: true, systemPrompt: 'system prompt' });
        mockGateway.applyTemplate.mockResolvedValue({ success: false, error: 'Model did not return a prompt' });

        const response = await buildUseCase().execute({ hydrated });

        expect(response).toEqual({
            success: false,
            error: 'Model did not return a prompt'
        });
    });

    it('fails when the adventure id is blank', async () => {
        const response = await buildUseCase().execute({ adventureId: ' ' });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(mockAdventureRepository.getAdventureById).not.toHaveBeenCalled();
    });

    it('fails when the hydrate service succeeds without a hydrated adventure', async () => {
        mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: createAdventureHelper() });
        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

        expect(response).toEqual({ success: false, error: 'Failed to hydrate adventure' });
    });

    it.each([
        [{ success: false, error: 'Template failure' }, 'Template failure'],
        [{ success: true }, undefined]
    ])('fails without applying the template when the system prompt answers %j', async (systemPromptResponse, error) => {
        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue(systemPromptResponse);

        const response = await buildUseCase().execute({ hydrated: createHydratedAdventureHelper() });

        expect(response).toEqual({ success: false, error });
        expect(mockGateway.applyTemplate).not.toHaveBeenCalled();
    });

    it.each([
        [{ success: false }, 'Model did not return a prompt'],
        [{ success: true, prompt: '' }, 'Model did not return a prompt']
    ])('falls back to a generic error when the gateway answers %j', async (templateResponse, error) => {
        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue({ success: true, systemPrompt: 'system prompt' });
        mockGateway.applyTemplate.mockResolvedValue(templateResponse);

        const response = await buildUseCase().execute({ hydrated: createHydratedAdventureHelper() });

        expect(response).toEqual({ success: false, error });
    });

    describe('world master runtime', () => {
        beforeEach(() => {
            mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue({ success: true, systemPrompt: 'system prompt' });
            mockGateway.applyTemplate.mockResolvedValue({ success: true, prompt: 'final prompt' });
        });

        it('uses the assistant of the character acting as world master when there is no dedicated one', async () => {
            const base = createHydratedAdventureHelper({ withoutWorldMaster: true, modelId: 'character-model' });
            const hydrated = { ...base, characters: [{ ...base.characters[0], worldMaster: true }] };

            const response = await buildUseCase().execute({ hydrated });

            expect(response).toEqual({ success: true, prompt: 'final prompt' });
            expect(mockGateway.applyTemplate).toHaveBeenCalledWith(expect.objectContaining({ modelId: 'character-model' }));
        });

        it('fails when there is neither a world master nor a character acting as one', async () => {
            const response = await buildUseCase().execute({ hydrated: createHydratedAdventureHelper({ withoutWorldMaster: true }) });

            expect(response).toEqual({ success: false, error: 'WorldMaster not found' });
            expect(mockGateway.applyTemplate).not.toHaveBeenCalled();
        });

        it('fails when the world master assistant is not hydrated', async () => {
            const hydrated = { ...createHydratedAdventureHelper(), assistants: {} };

            const response = await buildUseCase().execute({ hydrated });

            expect(response.success).toBe(false);
            expect(response.error).toContain('Assistant not found');
        });

        it('fails when the assistant connection is not hydrated', async () => {
            const hydrated = { ...createHydratedAdventureHelper(), connections: [] };

            const response = await buildUseCase().execute({ hydrated });

            expect(response.success).toBe(false);
            expect(response.error).toContain('Connection not found');
        });

        it('fails when the assistant has no model', async () => {
            const response = await buildUseCase().execute({ hydrated: createHydratedAdventureHelper({ modelId: '' }) });

            expect(response.success).toBe(false);
            expect(mockGateway.applyTemplate).not.toHaveBeenCalled();
        });
    });

    describe('when loading the adventure by id', () => {
        it('hydrates the adventure loaded from the repository', async () => {
            const adventure = createAdventureHelper();
            mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure });
            mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true, hydrated: createHydratedAdventureHelper({ adventure }) });
            mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue({ success: true, systemPrompt: 'system prompt' });
            mockGateway.applyTemplate.mockResolvedValue({ success: true, prompt: 'final prompt' });

            const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

            expect(response).toEqual({ success: true, prompt: 'final prompt' });
            expect(mockAdventureRepository.getAdventureById).toHaveBeenCalledWith('adventure-1');
            expect(mockHydrateAdventureService.hydrate).toHaveBeenCalledWith({ adventure });
        });

        it('returns the repository error when loading fails', async () => {
            mockAdventureRepository.getAdventureById.mockResolvedValue({ success: false, error: 'Database error' });

            const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

            expect(response).toEqual({ success: false, error: 'Database error' });
            expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
        });

        it('fails when the repository does not find the adventure', async () => {
            mockAdventureRepository.getAdventureById.mockResolvedValue({ success: true, adventure: undefined });

            const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

            expect(response).toEqual({ success: false, error: 'Failed to hydrate adventure' });
        });
    });
});
