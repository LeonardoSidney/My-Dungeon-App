import { GetSystemPromptsController } from '@adapters/controllers';
import { IGetSystemPromptsUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { SystemPrompt } from '@domain/entities';

// Mock das dependências
const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};

const mockUseCase = {
    execute: jest.fn()
};

describe('GetSystemPromptsController', () => {
    let controller: GetSystemPromptsController;

    beforeEach(() => {
        controller = new GetSystemPromptsController(mockLogger as unknown as ILogger, mockUseCase as unknown as IGetSystemPromptsUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockSystemPrompts: SystemPrompt[] = [
            {
                id: '1',
                name: 'System Prompt 1',
                content: 'Content 1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'System Prompt 2',
                content: 'Content 2',
                observation: 'Test observation',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockSystemPrompts);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetSystemPromptsController::handle');
    });

    it('should call useCase.execute when handling a request', async () => {
        const mockSystemPrompts: SystemPrompt[] = [
            {
                id: '1',
                name: 'System Prompt 1',
                content: 'Content 1',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockSystemPrompts);

        await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalled();
    });

    it('should return system prompts array when use case succeeds', async () => {
        const mockSystemPrompts: SystemPrompt[] = [
            {
                id: '1',
                name: 'System Prompt 1',
                content: 'Content 1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                name: 'System Prompt 2',
                content: 'Content 2',
                observation: 'Test observation',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        mockUseCase.execute.mockResolvedValue(mockSystemPrompts);

        const response = await controller.handle();

        expect(response).toEqual(mockSystemPrompts);
        expect(Array.isArray(response)).toBe(true);
        expect(response.length).toBe(2);
    });

    it('should return empty array when no system prompts exist', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        const response = await controller.handle();

        expect(response).toEqual([]);
        expect(Array.isArray(response)).toBe(true);
        expect(response.length).toBe(0);
    });
});
