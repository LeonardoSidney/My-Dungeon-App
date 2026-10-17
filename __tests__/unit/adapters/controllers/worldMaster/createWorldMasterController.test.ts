import { CreateWorldMasterController } from '@adapters/controllers';
import { ICreateWorldMasterUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { WorldMaster } from '@domain/entities';

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

describe('CreateWorldMasterController', () => {
    let controller: CreateWorldMasterController;

    beforeEach(() => {
        controller = new CreateWorldMasterController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateWorldMasterUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockRequest = {
            name: 'Test WorldMaster',
            activationWord: 'activate',
            prompt: 'Master prompt',
            observation: 'Test observation',
            assistantId: '1'
        };

        const mockWorldMaster: WorldMaster = {
            id: '1',
            name: 'Test WorldMaster',
            activationWord: 'activate',
            prompt: 'Master prompt',
            observation: 'Test observation',
            assistantId: '1',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse = {
            success: true,
            worldMaster: mockWorldMaster,
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateWorldMasterController::handle');
    });

    it('should execute use case with correct parameters', async () => {
        const mockRequest = {
            name: 'Dungeon Master',
            activationWord: 'start',
            prompt: 'A dark fantasy dungeon master',
            observation: 'You enter a dark dungeon',
            assistantId: '1'
        };

        const mockResponse = {
            success: true,
            worldMaster: {
                id: '1',
                name: 'Dungeon Master',
                activationWord: 'start',
                prompt: 'A dark fantasy dungeon master',
                observation: 'You enter a dark dungeon',
                assistantId: '1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: mockRequest.name,
            activationWord: mockRequest.activationWord,
            prompt: mockRequest.prompt,
            observation: mockRequest.observation,
            assistantId: mockRequest.assistantId
        });
    });

    it('should execute use case without observation when not provided', async () => {
        const mockRequest = {
            name: 'Simple WorldMaster',
            activationWord: 'go',
            prompt: 'A simple world master',
            assistantId: '1'
        };

        const mockResponse = {
            success: true,
            worldMaster: {
                id: '2',
                name: 'Simple WorldMaster',
                activationWord: 'go',
                prompt: 'A simple world master',
                observation: undefined,
                assistantId: '1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: mockRequest.name,
            activationWord: mockRequest.activationWord,
            prompt: mockRequest.prompt,
            observation: undefined,
            assistantId: mockRequest.assistantId
        });
    });

    it('should return success response when use case succeeds', async () => {
        const mockRequest = {
            name: 'Success WorldMaster',
            activationWord: 'success',
            prompt: 'Success prompt',
            assistantId: '1'
        };

        const mockWorldMaster: WorldMaster = {
            id: '3',
            name: 'Success WorldMaster',
            activationWord: 'success',
            prompt: 'Success prompt',
            observation: undefined,
            assistantId: '1',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse = {
            success: true,
            worldMaster: mockWorldMaster,
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual(mockResponse);
        expect(result.success).toBe(true);
        expect(result.worldMaster).toEqual(mockWorldMaster);
        expect(result.error).toBeUndefined();
    });

    it('should return error response when use case fails', async () => {
        const mockRequest = {
            name: 'Failed WorldMaster',
            activationWord: 'fail',
            prompt: 'Failed prompt',
            assistantId: '1'
        };

        const mockResponse = {
            success: false,
            worldMaster: undefined,
            error: 'Creation failed'
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual(mockResponse);
        expect(result.success).toBe(false);
        expect(result.worldMaster).toBeUndefined();
        expect(result.error).toBe('Creation failed');
    });

    it('should pass assistantId correctly to use case', async () => {
        const mockRequest = {
            name: 'Assistant WorldMaster',
            activationWord: 'summon',
            prompt: 'Summon prompt',
            observation: 'Summon observation',
            assistantId: 'assistant-1'
        };

        const mockResponse = {
            success: true,
            worldMaster: {
                id: '4',
                name: 'Assistant WorldMaster',
                activationWord: 'summon',
                prompt: 'Summon prompt',
                observation: 'Summon observation',
                assistantId: 'assistant-1',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockUseCase.execute).toHaveBeenCalledWith(
            expect.objectContaining({
                assistantId: 'assistant-1'
            })
        );
    });
});
