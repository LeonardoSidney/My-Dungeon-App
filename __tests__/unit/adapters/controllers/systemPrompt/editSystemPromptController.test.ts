import { EditSystemPromptController } from '@adapters/controllers';
import { IEditSystemPromptUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { SystemPrompt } from '@domain/entities';

const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};

const mockUseCase = {
    execute: jest.fn()
};

describe('EditSystemPromptController', () => {
    let controller: EditSystemPromptController;

    beforeEach(() => {
        controller = new EditSystemPromptController(mockLogger as unknown as ILogger, mockUseCase as unknown as IEditSystemPromptUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockSystemPrompt: SystemPrompt = {
            id: '1',
            name: 'Test System Prompt',
            content: 'Test content',
            observation: 'Test observation',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            systemPrompt: mockSystemPrompt
        });

        await controller.handle({
            id: '1',
            editParams: {
                name: 'Test System Prompt',
                content: 'Test content',
                observation: 'Test observation'
            }
        });

        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditSystemPromptController::handle');
    });

    it('should call useCase.execute with correct params when handling a request', async () => {
        const mockSystemPrompt: SystemPrompt = {
            id: '1',
            name: 'Test System Prompt',
            content: 'Test content',
            observation: 'Test observation',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            systemPrompt: mockSystemPrompt
        });

        const request = {
            id: '1',
            editParams: {
                name: 'Test System Prompt',
                content: 'Test content',
                observation: 'Test observation'
            }
        };

        await controller.handle(request);

        expect(mockUseCase.execute).toHaveBeenCalledWith(request);
    });

    it('should return systemPrompt when use case succeeds', async () => {
        mockUseCase.execute.mockResolvedValue({
            success: true,
            systemPrompt: {
                id: '1',
                name: 'Test System Prompt',
                content: 'Test content',
                observation: 'Test observation',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        const response = await controller.handle({
            id: '1',
            editParams: {
                name: 'Test System Prompt',
                content: 'Test content',
                observation: 'Test observation'
            }
        });

        expect(response.success).toBe(true);
        expect(response.systemPrompt).toMatchObject({
            id: '1',
            name: 'Test System Prompt',
            content: 'Test content',
            observation: 'Test observation',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        });
    });

    it('should return systemPrompt without observation when observation is not provided', async () => {
        mockUseCase.execute.mockResolvedValue({
            success: true,
            systemPrompt: {
                id: '1',
                name: 'Test System Prompt',
                content: 'Test content',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        const response = await controller.handle({
            id: '1',
            editParams: {
                name: 'Test System Prompt',
                content: 'Test content'
            }
        });

        expect(response.success).toBe(true);
        expect(response.systemPrompt).toMatchObject({
            id: '1',
            name: 'Test System Prompt',
            content: 'Test content',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        });
    });

    it('should return error when use case fails', async () => {
        mockUseCase.execute.mockResolvedValue({
            success: false,
            error: 'Failed to edit system prompt'
        });

        const response = await controller.handle({
            id: '1',
            editParams: {
                name: 'Test System Prompt',
                content: 'Test content'
            }
        });

        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to edit system prompt');
    });
});
