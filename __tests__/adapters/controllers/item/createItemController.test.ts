import { CreateItemController } from '../../../../src/adapters/controllers/item/createItemController';
import { CreateItemRequest, CreateItemResponse } from '@domain/controllers';
import { ICreateItemUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Item } from '@domain/entities';

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

describe('CreateItemController', () => {
    let controller: CreateItemController;

    beforeEach(() => {
        controller = new CreateItemController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateItemUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const request: CreateItemRequest = {
            name: 'Test Item',
            activationWord: 'activate',
            prompt: 'Item prompt'
        };

        const mockItem: Item = {
            id: '1',
            name: 'Test Item',
            activationWord: 'activate',
            prompt: 'Item prompt',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse: CreateItemResponse = {
            success: true,
            item: mockItem
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(request);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateItemController::handle');
    });

    it('should call use case execute with correct parameters', async () => {
        const request: CreateItemRequest = {
            name: 'Test Item',
            activationWord: 'activate',
            prompt: 'Item prompt'
        };

        const mockItem: Item = {
            id: '1',
            name: 'Test Item',
            activationWord: 'activate',
            prompt: 'Item prompt',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse: CreateItemResponse = {
            success: true,
            item: mockItem
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(request);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: request.name,
            activationWord: request.activationWord,
            prompt: request.prompt,
            observation: undefined
        });
    });

    it('should pass request with optional observation field to use case', async () => {
        const request: CreateItemRequest = {
            name: 'Test Item',
            activationWord: 'activate',
            prompt: 'Item prompt',
            observation: 'Test observation'
        };

        const mockItem: Item = {
            id: '1',
            name: 'Test Item',
            activationWord: 'activate',
            prompt: 'Item prompt',
            observation: 'Test observation',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse: CreateItemResponse = {
            success: true,
            item: mockItem
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(request);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: request.name,
            activationWord: request.activationWord,
            prompt: request.prompt,
            observation: request.observation
        });
    });

    it('should return success response with item when use case succeeds', async () => {
        const request: CreateItemRequest = {
            name: 'Test Item',
            activationWord: 'activate',
            prompt: 'Item prompt'
        };

        const mockItem: Item = {
            id: '1',
            name: 'Test Item',
            activationWord: 'activate',
            prompt: 'Item prompt',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse: CreateItemResponse = {
            success: true,
            item: mockItem
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(request);

        expect(result).toEqual(mockResponse);
        expect(result.success).toBe(true);
        expect(result.item).toEqual(mockItem);
    });

    it('should return error response when use case fails', async () => {
        const request: CreateItemRequest = {
            name: 'Test Item',
            activationWord: 'activate',
            prompt: 'Item prompt'
        };

        const mockResponse: CreateItemResponse = {
            success: false,
            error: 'Failed to create item'
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(request);

        expect(result).toEqual(mockResponse);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Failed to create item');
    });
});
