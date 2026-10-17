import { GetAdventureSystemPromptUseCase } from '@application/use-cases';
import { ITextGeneration } from '@domain/providers';
import { IHydrateAdventureService } from '@domain/services';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createWorldMasterHelper } from '@test/helpers';

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

function buildUseCase (): GetAdventureSystemPromptUseCase {
    return new GetAdventureSystemPromptUseCase(
        mockLogger,
        mockTextGeneration as unknown as ITextGeneration,
        mockHydrateAdventureService as unknown as IHydrateAdventureService
    );
}

describe('GetAdventureSystemPromptUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the composed system prompt when hydration succeeds', async () => {
        const adventure = createAdventureHelper();
        const worldMaster = createWorldMasterHelper();

        mockHydrateAdventureService.hydrate.mockResolvedValue({
            success: true,
            hydrated: {
                adventure,
                characters: [],
                worldMaster,
                assistants: {},
                samplers: [],
                connections: [],
                worlds: [],
                locations: [],
                items: [],
                systemPrompts: [],
                abilities: [],
                proficiencies: [],
                statuses: []
            }
        });
        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue('# WORLD MASTER\nprompt here');

        const response = await buildUseCase().execute({ adventure });

        expect(response.success).toBe(true);
        expect(response.systemPrompt).toBe('# WORLD MASTER\nprompt here');
        expect(mockHydrateAdventureService.hydrate).toHaveBeenCalledWith({ adventure });
        expect(mockTextGeneration.buildAdventureTextSystemPrompt).toHaveBeenCalledTimes(1);
    });

    it('should fail when hydration fails', async () => {
        const adventure = createAdventureHelper();

        mockHydrateAdventureService.hydrate.mockResolvedValue({
            success: false,
            error: 'Some characters were not found'
        });

        const response = await buildUseCase().execute({ adventure });

        expect(response.success).toBe(false);
        expect(response.error).toBe('Some characters were not found');
        expect(mockTextGeneration.buildAdventureTextSystemPrompt).not.toHaveBeenCalled();
    });

    it('should fail when hydration fails without an error message', async () => {
        const adventure = createAdventureHelper();

        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ adventure });

        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to hydrate adventure');
    });

    it('should fail when the composed system prompt is empty', async () => {
        const adventure = createAdventureHelper();

        mockHydrateAdventureService.hydrate.mockResolvedValue({
            success: true,
            hydrated: {
                adventure,
                characters: [],
                worldMaster: undefined,
                assistants: {},
                samplers: [],
                connections: [],
                worlds: [],
                locations: [],
                items: [],
                systemPrompts: [],
                abilities: [],
                proficiencies: [],
                statuses: []
            }
        });
        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue('   ');

        const response = await buildUseCase().execute({ adventure });

        expect(response.success).toBe(false);
        expect(response.error).toBe('System prompt is empty');
    });

    it('should fail with the error message when the provider throws', async () => {
        const adventure = createAdventureHelper();

        mockHydrateAdventureService.hydrate.mockResolvedValue({
            success: true,
            hydrated: {
                adventure,
                characters: [],
                worldMaster: undefined,
                assistants: {},
                samplers: [],
                connections: [],
                worlds: [],
                locations: [],
                items: [],
                systemPrompts: [],
                abilities: [],
                proficiencies: [],
                statuses: []
            }
        });
        mockTextGeneration.buildAdventureTextSystemPrompt.mockImplementation(() => {
            throw new Error('Template failure');
        });

        const response = await buildUseCase().execute({ adventure });

        expect(response.success).toBe(false);
        expect(response.error).toBe('Template failure');
        expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should fail with a generic error when the provider throws a non-Error value', async () => {
        const adventure = createAdventureHelper();

        mockHydrateAdventureService.hydrate.mockResolvedValue({
            success: true,
            hydrated: {
                adventure,
                characters: [],
                worldMaster: undefined,
                assistants: {},
                samplers: [],
                connections: [],
                worlds: [],
                locations: [],
                items: [],
                systemPrompts: [],
                abilities: [],
                proficiencies: [],
                statuses: []
            }
        });
        mockTextGeneration.buildAdventureTextSystemPrompt.mockImplementation(() => {
            throw 'non-error';
        });

        const response = await buildUseCase().execute({ adventure });

        expect(response.success).toBe(false);
        expect(response.error).toBe('Get adventure system prompt failed');
    });
});
