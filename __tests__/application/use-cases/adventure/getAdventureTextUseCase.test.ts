import { GetAdventureTextUseCase } from '@application/use-cases';
import { ITextGeneration } from '@domain/providers';
import { IModelProviderGateway } from '@domain/gateways';
import { IHydrateAdventureService } from '@domain/services';
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

function buildUseCase (): GetAdventureTextUseCase {
    return new GetAdventureTextUseCase(
        mockLogger,
    mockTextGeneration as unknown as ITextGeneration,
    mockGateway as unknown as IModelProviderGateway,
    mockHydrateAdventureService as unknown as IHydrateAdventureService
    );
}

describe('GetAdventureTextUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('reuses the provided hydrated adventure without calling the hydrate service', async () => {
        const adventure = createAdventureHelper();
        const hydrated = createHydratedAdventureHelper({ adventure });

        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue('system prompt');
        mockGateway.applyTemplate.mockResolvedValue('final prompt');

        const response = await buildUseCase().execute({ adventure, hydrated });

        expect(response).toEqual({ success: true, prompt: 'final prompt' });
        expect(mockHydrateAdventureService.hydrate).not.toHaveBeenCalled();
        expect(mockTextGeneration.buildAdventureTextSystemPrompt).toHaveBeenCalledWith(hydrated);
        expect(mockGateway.applyTemplate).toHaveBeenCalledWith(
            expect.objectContaining({ id: '1' }),
            '1',
            'system prompt',
            adventure.chat
        );
    });

    it('hydrates the adventure when no hydrated adventure is provided', async () => {
        const adventure = createAdventureHelper();
        const hydrated = createHydratedAdventureHelper({ adventure });

        mockHydrateAdventureService.hydrate.mockResolvedValue({ success: true, hydrated });
        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue('system prompt');
        mockGateway.applyTemplate.mockResolvedValue('final prompt');

        const response = await buildUseCase().execute({ adventure });

        expect(response).toEqual({ success: true, prompt: 'final prompt' });
        expect(mockHydrateAdventureService.hydrate).toHaveBeenCalledWith({ adventure });
    });

    it('fails when hydration is not provided and the hydrate service fails', async () => {
        const adventure = createAdventureHelper();

        mockHydrateAdventureService.hydrate.mockResolvedValue({
            success: false,
            error: 'Some characters were not found'
        });

        const response = await buildUseCase().execute({ adventure });

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

        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue('system prompt');
        mockGateway.applyTemplate.mockResolvedValue(undefined);

        const response = await buildUseCase().execute({ adventure, hydrated });

        expect(response).toEqual({
            success: false,
            error: 'Model did not return a prompt'
        });
    });
});
