import { CreateSystemPromptController } from '../../../../src/adapters/controllers/systemPrompt/createSystemPromptController';
import { ICreateSystemPromptUseCase } from '@domain/use-cases';
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

describe('CreateSystemPromptController', () => {
    let controller: CreateSystemPromptController;

    beforeEach(() => {
        controller = new CreateSystemPromptController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateSystemPromptUseCase);
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
            name: 'Test System Prompt',
            content: 'Test content',
            observation: 'Test observation'
        });

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateSystemPromptController::handle');
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
            name: 'Test System Prompt',
            content: 'Test content',
            observation: 'Test observation'
        };

        await controller.handle(request);

        expect(mockUseCase.execute).toHaveBeenCalledWith(request);
    });

    it('should return systemPrompt when use case succeeds', async () => {
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

        const response = await controller.handle({
            name: 'Test System Prompt',
            content: 'Test content',
            observation: 'Test observation'
        });

        expect(response.success).toBe(true);
        expect(response.systemPrompt).toEqual(mockSystemPrompt);
    });

    it('should return systemPrompt without observation when observation is not provided', async () => {
        const mockSystemPrompt: SystemPrompt = {
            id: '1',
            name: 'Test System Prompt',
            content: 'Test content',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            systemPrompt: mockSystemPrompt
        });

        const response = await controller.handle({
            name: 'Test System Prompt',
            content: 'Test content'
        });

        expect(response.success).toBe(true);
        expect(response.systemPrompt).toEqual(mockSystemPrompt);
    });

    it('should return error when use case fails', async () => {
        mockUseCase.execute.mockResolvedValue({
            success: false,
            error: 'Failed to create system prompt'
        });

        const response = await controller.handle({
            name: 'Test System Prompt',
            content: 'Test content'
        });

        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to create system prompt');
    });
});
