import { GetAdventureSystemPromptController } from '@adapters/controllers';
import { IGetAdventureSystemPromptUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { createAdventureHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockUseCase = {
    execute: jest.fn()
};

describe('GetAdventureSystemPromptController', () => {
    let controller: GetAdventureSystemPromptController;

    beforeEach(() => {
        controller = new GetAdventureSystemPromptController(
            mockLogger,
            mockUseCase as unknown as IGetAdventureSystemPromptUseCase
        );
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        mockUseCase.execute.mockResolvedValue({ success: true, systemPrompt: 'prompt' });
        const adventure = createAdventureHelper();

        await controller.handle({ adventure });

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetAdventureSystemPromptController::handle');
    });

    it('should execute the use case and return the system prompt', async () => {
        mockUseCase.execute.mockResolvedValue({ success: true, systemPrompt: '# prompt' });
        const adventure = createAdventureHelper();

        const result = await controller.handle({ adventure });

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
        expect(mockUseCase.execute).toHaveBeenCalledWith({ adventure });
        expect(result).toEqual({ success: true, systemPrompt: '# prompt', error: undefined });
    });

    it('should return the error when the use case fails', async () => {
        mockUseCase.execute.mockResolvedValue({ success: false, error: 'Failed to hydrate adventure' });
        const adventure = createAdventureHelper();

        const result = await controller.handle({ adventure });

        expect(result).toEqual({ success: false, systemPrompt: undefined, error: 'Failed to hydrate adventure' });
    });
});
