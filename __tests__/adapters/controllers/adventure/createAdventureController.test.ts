import { CreateAdventureController } from '@adapters/controllers';
import { ICreateAdventureUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { createAdventureRequestHelper } from '../../../../__helpers__/createAdventureRequestHelper';

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

describe('CreateAdventureController', () => {
    let controller: CreateAdventureController;

    beforeEach(() => {
        controller = new CreateAdventureController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateAdventureUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockRequest = createAdventureRequestHelper();

        const mockResponse = {
            success: true,
            adventure: { id: '1', name: 'Test Adventure' },
            error: null
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateAdventureController::handle');
    });

    it('should execute use case with correct parameters', async () => {
        const mockRequest = createAdventureRequestHelper();

        const mockResponse = {
            success: true,
            adventure: { id: '1', name: 'Test Adventure' },
            error: null
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockUseCase.execute).toHaveBeenCalledWith(mockRequest);
    });

    it('should return success response when use case succeeds', async () => {
        const mockRequest = createAdventureRequestHelper();

        const mockResponse = {
            success: true,
            adventure: { id: '1', name: 'Test Adventure' },
            error: null
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual({
            success: true,
            adventure: { id: '1', name: 'Test Adventure' },
            error: null
        });
    });

    it('should return error response when use case fails', async () => {
        const mockRequest = createAdventureRequestHelper();

        const mockResponse = {
            success: false,
            adventure: null,
            error: 'Adventure creation failed'
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual({
            success: false,
            adventure: null,
            error: 'Adventure creation failed'
        });
    });

    it('should handle empty arrays correctly', async () => {
        const mockRequest = createAdventureRequestHelper({
            characterIds: [],
            systemPromptIds: [],
            itemIds: [],
            locationIds: [],
            worldIds: []
        });

        const mockResponse = {
            success: true,
            adventure: { id: '1', name: 'Test Adventure' },
            error: null
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual({
            success: true,
            adventure: { id: '1', name: 'Test Adventure' },
            error: null
        });
    });

    it('should handle null values correctly', async () => {
        const mockRequest = createAdventureRequestHelper({
            characterIds: null as any,
            systemPromptIds: null as any,
            itemIds: null as any,
            locationIds: null as any,
            worldIds: null as any,
            worldMasterId: null as any
        });

        const mockResponse = {
            success: true,
            adventure: { id: '1', name: 'Test Adventure' },
            error: null
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual({
            success: true,
            adventure: { id: '1', name: 'Test Adventure' },
            error: null
        });
    });
});
