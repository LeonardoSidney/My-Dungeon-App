import { CreateWorldController } from '@adapters/controllers';
import { ICreateWorldUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { World } from '@domain/entities';

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

describe('CreateWorldController', () => {
    let controller: CreateWorldController;

    beforeEach(() => {
        controller = new CreateWorldController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateWorldUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockRequest = {
            name: 'Test World',
            activationWord: 'activate',
            prompt: 'World prompt',
            observation: 'Test observation'
        };

        const mockWorld: World = {
            id: '1',
            name: 'Test World',
            activationWord: 'activate',
            prompt: 'World prompt',
            observation: 'Test observation',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse = {
            success: true,
            world: mockWorld,
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateWorldController::handle');
    });

    it('should execute use case with correct parameters', async () => {
        const mockRequest = {
            name: 'New World',
            activationWord: 'enter',
            prompt: 'A dark fantasy world',
            observation: 'You find yourself in a mysterious realm'
        };

        const mockResponse = {
            success: true,
            world: {
                id: '1',
                name: 'New World',
                activationWord: 'enter',
                prompt: 'A dark fantasy world',
                observation: 'You find yourself in a mysterious realm',
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
            observation: mockRequest.observation
        });
    });

    it('should execute use case without observation when not provided', async () => {
        const mockRequest = {
            name: 'Simple World',
            activationWord: 'go',
            prompt: 'A simple world'
        };

        const mockResponse = {
            success: true,
            world: {
                id: '2',
                name: 'Simple World',
                activationWord: 'go',
                prompt: 'A simple world',
                observation: undefined,
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
            observation: undefined
        });
    });

    it('should return success response when use case succeeds', async () => {
        const mockRequest = {
            name: 'Success World',
            activationWord: 'success',
            prompt: 'Success prompt'
        };

        const mockWorld: World = {
            id: '3',
            name: 'Success World',
            activationWord: 'success',
            prompt: 'Success prompt',
            observation: undefined,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse = {
            success: true,
            world: mockWorld,
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual({
            success: true,
            world: mockWorld,
            error: undefined
        });
    });
});
