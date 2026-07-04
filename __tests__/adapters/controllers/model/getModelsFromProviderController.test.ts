import { GetModelsFromProviderController } from '../../../../src/adapters/controllers/model/getModelsFromProviderController';
import { IGetModelsFromProviderUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Connection, Model } from '@domain/entities';

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

describe('GetModelsFromProviderController', () => {
    let controller: GetModelsFromProviderController;

    beforeEach(() => {
        controller = new GetModelsFromProviderController(mockLogger as unknown as ILogger, mockUseCase as unknown as IGetModelsFromProviderUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockConnection: Connection = {
            id: '1',
            name: 'Test Connection',
            ip: 'localhost',
            port: 8080,
            auth: 'Bearer token',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockModels: Model[] = [
            {
                id: '1',
                name: 'Test Model 1',
                connection: mockConnection,
                nCtx: 4096,
                ownedBy: 'test'
            },
            {
                id: '2',
                name: 'Test Model 2',
                connection: mockConnection,
                nCtx: 8192,
                ownedBy: 'test'
            }
        ];

        mockUseCase.execute.mockResolvedValue({
            success: true,
            models: mockModels
        });

        await controller.handle({ connection: mockConnection });

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetModelsFromProviderController::handle');
    });

    it('should call useCase.execute when handling a request', async () => {
        const mockConnection: Connection = {
            id: '1',
            name: 'Test Connection',
            ip: 'localhost',
            port: 8080,
            auth: 'Bearer token',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockModels: Model[] = [
            {
                id: '1',
                name: 'Test Model',
                connection: mockConnection,
                nCtx: 4096,
                ownedBy: 'test'
            }
        ];

        mockUseCase.execute.mockResolvedValue({
            success: true,
            models: mockModels
        });

        await controller.handle({ connection: mockConnection });

        expect(mockUseCase.execute).toHaveBeenCalledWith({ connection: mockConnection });
    });

    it('should return models when use case succeeds', async () => {
        const mockConnection: Connection = {
            id: '1',
            name: 'Test Connection',
            ip: 'localhost',
            port: 8080,
            auth: 'Bearer token',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockModels: Model[] = [
            {
                id: '1',
                name: 'Model 1',
                connection: mockConnection,
                nCtx: 4096,
                ownedBy: 'test'
            },
            {
                id: '2',
                name: 'Model 2',
                connection: mockConnection,
                nCtx: 8192,
                ownedBy: 'test'
            }
        ];

        mockUseCase.execute.mockResolvedValue({
            success: true,
            models: mockModels
        });

        const response = await controller.handle({ connection: mockConnection });

        expect(response.success).toBe(true);
        expect(response.models).toEqual(mockModels);
        expect(response.error).toBeUndefined();
    });

    it('should return error when use case fails', async () => {
        const mockConnection: Connection = {
            id: '1',
            name: 'Test Connection',
            ip: 'localhost',
            port: 8080,
            auth: 'Bearer token',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue({
            success: false,
            error: 'Connection failed'
        });

        const response = await controller.handle({ connection: mockConnection });

        expect(response.success).toBe(false);
        expect(response.models).toBeUndefined();
        expect(response.error).toBe('Connection failed');
    });

    it('should pass connection to use case', async () => {
        const mockConnection: Connection = {
            id: '1',
            name: 'Test Connection',
            ip: 'localhost',
            port: 8080,
            auth: 'Bearer token',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            models: []
        });

        await controller.handle({ connection: mockConnection });

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
        expect(mockUseCase.execute).toHaveBeenCalledWith({ connection: mockConnection });
    });
});
