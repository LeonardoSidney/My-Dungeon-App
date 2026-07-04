import { CreateLocationController } from '../../../../src/adapters/controllers/location/createLocationController';
import { ICreateLocationUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Location } from '@domain/entities';

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

describe('CreateLocationController', () => {
    let controller: CreateLocationController;

    beforeEach(() => {
        controller = new CreateLocationController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateLocationUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockRequest = {
            name: 'Test Location',
            activationWord: 'activate',
            prompt: 'Location prompt',
            observation: 'Test observation'
        };

        const mockLocation: Location = {
            id: '1',
            name: 'Test Location',
            activationWord: 'activate',
            prompt: 'Location prompt',
            observation: 'Test observation',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse = {
            success: true,
            location: mockLocation,
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateLocationController::handle');
    });

    it('should execute use case with correct parameters', async () => {
        const mockRequest = {
            name: 'New Location',
            activationWord: 'enter',
            prompt: 'A dark cave',
            observation: 'You see a cave ahead'
        };

        const mockResponse = {
            success: true,
            location: {
                id: '1',
                name: 'New Location',
                activationWord: 'enter',
                prompt: 'A dark cave',
                observation: 'You see a cave ahead',
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
            name: 'Simple Location',
            activationWord: 'go',
            prompt: 'A simple room'
        };

        const mockResponse = {
            success: true,
            location: {
                id: '2',
                name: 'Simple Location',
                activationWord: 'go',
                prompt: 'A simple room',
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
            name: 'Success Location',
            activationWord: 'success',
            prompt: 'Success prompt'
        };

        const mockLocation: Location = {
            id: '3',
            name: 'Success Location',
            activationWord: 'success',
            prompt: 'Success prompt',
            observation: undefined,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse = {
            success: true,
            location: mockLocation,
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual({
            success: true,
            location: mockLocation,
            error: undefined
        });
    });

    it('should return error response when use case fails', async () => {
        const mockRequest = {
            name: 'Fail Location',
            activationWord: 'fail',
            prompt: 'Fail prompt'
        };

        const mockResponse = {
            success: false,
            location: undefined,
            error: 'Failed to create location'
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual({
            success: false,
            location: undefined,
            error: 'Failed to create location'
        });
    });

    it('should handle request with all optional fields', async () => {
        const mockRequest = {
            name: 'Full Location',
            activationWord: 'full',
            prompt: 'Full prompt',
            observation: 'Full observation'
        };

        const mockLocation: Location = {
            id: '4',
            name: 'Full Location',
            activationWord: 'full',
            prompt: 'Full prompt',
            observation: 'Full observation',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse = {
            success: true,
            location: mockLocation,
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
        expect(result.success).toBe(true);
        expect(result.location).toEqual(mockLocation);
    });
});
