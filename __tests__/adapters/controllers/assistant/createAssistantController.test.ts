import { CreateAssistantController } from '@adapters/controllers';
import { ICreateAssistantUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { createModelHelper } from '../../../../__helpers__/createModelHelper';
import { createSamplerHelper } from '../../../../__helpers__/createSamplerHelper';
import { createAssistantHelper } from '../../../../__helpers__/createAssistantHelper';

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

describe('CreateAssistantController', () => {
    let controller: CreateAssistantController;

    beforeEach(() => {
        controller = new CreateAssistantController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateAssistantUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const params = {
            name: 'Test Assistant',
            observation: 'Test observation',
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        const mockResponse = {
            success: true,
            assistant: createAssistantHelper()
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateAssistantController::handle');
    });

    it('should call use case execute with correct parameters', async () => {
        const params = {
            name: 'Test Assistant',
            observation: 'Test observation',
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        const mockResponse = {
            success: true,
            assistant: createAssistantHelper()
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: params.name,
            observation: params.observation,
            model: params.model,
            sampler: params.sampler
        });
    });

    it('should pass params without observation to use case', async () => {
        const params = {
            name: 'Test Assistant Without Observation',
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        const mockResponse = {
            success: true,
            assistant: createAssistantHelper()
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: params.name,
            observation: undefined,
            model: params.model,
            sampler: params.sampler
        });
    });

    it('should return success response with assistant when use case succeeds', async () => {
        const params = {
            name: 'Test Assistant',
            observation: 'Test observation',
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        const mockAssistant = createAssistantHelper({ id: '1', name: 'Test Assistant' });
        const mockResponse = {
            success: true,
            assistant: mockAssistant
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(params);

        expect(result).toEqual({
            success: true,
            assistant: mockAssistant,
            error: undefined
        });
    });

    it('should return success false with error when use case fails', async () => {
        const params = {
            name: 'Test Assistant',
            observation: 'Test observation',
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        const mockResponse = {
            success: false,
            assistant: undefined,
            error: 'Assistant creation failed'
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(params);

        expect(result.success).toBe(false);
        expect(result.assistant).toBeUndefined();
        expect(result.error).toBe('Assistant creation failed');
    });

    it('should return response with success true and error undefined when successful', async () => {
        const params = {
            name: 'Test Assistant',
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        const mockAssistant = createAssistantHelper({ id: '1' });
        const mockResponse = {
            success: true,
            assistant: mockAssistant
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(params);

        expect(result.success).toBe(true);
        expect(result.assistant).toEqual(mockAssistant);
        expect(result.error).toBeUndefined();
    });

    it('should return response with all fields when successful', async () => {
        const params = {
            name: 'Test Assistant',
            observation: 'Test observation',
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        const mockAssistant = createAssistantHelper({ id: '1', name: 'Full Assistant' });
        const mockResponse = {
            success: true,
            assistant: mockAssistant
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(params);

        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('assistant');
        expect(result).toHaveProperty('error');
        expect(result.assistant?.id).toBe('1');
        expect(result.assistant?.name).toBe('Full Assistant');
    });

    it('should return response with all fields when failed', async () => {
        const params = {
            name: 'Test Assistant',
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        const mockResponse = {
            success: false,
            assistant: undefined,
            error: 'Validation error'
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(params);

        expect(result).toHaveProperty('success', false);
        expect(result).toHaveProperty('assistant');
        expect(result).toHaveProperty('error', 'Validation error');
        expect(result.assistant).toBeUndefined();
    });

    it('should call logger.info exactly once', async () => {
        const params = {
            name: 'Test Assistant',
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            assistant: createAssistantHelper()
        });

        await controller.handle(params);

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should call use case execute exactly once', async () => {
        const params = {
            name: 'Test Assistant',
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            assistant: createAssistantHelper()
        });

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should return undefined assistant when use case returns undefined assistant', async () => {
        const params = {
            name: 'Test Assistant',
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        mockUseCase.execute.mockResolvedValue({
            success: false,
            assistant: undefined,
            error: 'Failed to create assistant'
        });

        const result = await controller.handle(params);

        expect(result.success).toBe(false);
        expect(result.assistant).toBeUndefined();
        expect(result.error).toBe('Failed to create assistant');
    });

    it('should return assistant object when use case returns assistant', async () => {
        const params = {
            name: 'Test Assistant',
            observation: 'Test observation',
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        const mockAssistant = createAssistantHelper({
            id: 'unique-id',
            name: 'Unique Assistant'
        });

        mockUseCase.execute.mockResolvedValue({
            success: true,
            assistant: mockAssistant
        });

        const result = await controller.handle(params);

        expect(result.assistant).toBe(mockAssistant);
        expect(result.assistant?.id).toBe('unique-id');
        expect(result.assistant?.name).toBe('Unique Assistant');
    });

    it('should handle params with long name', async () => {
        const longName = 'A'.repeat(100);
        const params = {
            name: longName,
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            assistant: createAssistantHelper({ name: longName })
        });

        const result = await controller.handle(params);

        expect(result.success).toBe(true);
        expect(result.assistant?.name).toBe(longName);
    });

    it('should handle params with empty observation string', async () => {
        const params = {
            name: 'Test Assistant',
            observation: '',
            model: createModelHelper(),
            sampler: createSamplerHelper()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            assistant: createAssistantHelper()
        });

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: params.name,
            observation: '',
            model: params.model,
            sampler: params.sampler
        });
    });
});
