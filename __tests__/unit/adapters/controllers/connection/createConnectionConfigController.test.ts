import { CreateConnectionConfigController } from '@adapters/controllers';
import {
    CreateConnectionConfigControllerRequest,
    CreateConnectionConfigControllerResponse
} from '@domain/controllers';
import { ICreateConnectionConfigUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { createConnectionHelper } from '@test/helpers';

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

describe('CreateConnectionConfigController', () => {
    let controller: CreateConnectionConfigController;

    beforeEach(() => {
        controller = new CreateConnectionConfigController(
            mockLogger as unknown as ILogger,
            mockUseCase as unknown as ICreateConnectionConfigUseCase
        );
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const params: CreateConnectionConfigControllerRequest = {
            name: 'Test Connection',
            ip: 'localhost',
            port: 8080,
            auth: 'Bearer token'
        };

        const mockResponse: CreateConnectionConfigControllerResponse = {
            success: true,
            connection: createConnectionHelper()
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateConnectionConfigController::handle');
    });

    it('should call use case execute with correct parameters', async () => {
        const params: CreateConnectionConfigControllerRequest = {
            name: 'Test Connection',
            ip: '192.168.1.1',
            port: 3000,
            auth: 'Bearer mytoken'
        };

        const mockResponse: CreateConnectionConfigControllerResponse = {
            success: true,
            connection: createConnectionHelper({ name: 'Test Connection' })
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: params.name,
            ip: params.ip,
            port: params.port,
            auth: params.auth
        });
    });

    it('should pass params with optional port and auth fields to use case', async () => {
        const params: CreateConnectionConfigControllerRequest = {
            name: 'Minimal Connection',
            ip: '10.0.0.1'
        };

        const mockResponse: CreateConnectionConfigControllerResponse = {
            success: true,
            connection: createConnectionHelper({ name: 'Minimal Connection', ip: '10.0.0.1' })
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            name: params.name,
            ip: params.ip,
            port: undefined,
            auth: undefined
        });
    });

    it('should return success response with connection when use case succeeds', async () => {
        const params: CreateConnectionConfigControllerRequest = {
            name: 'Production Server',
            ip: '203.0.113.1',
            port: 443,
            auth: 'Bearer securetoken'
        };

        const mockConnection = createConnectionHelper({
            id: 'conn-1',
            name: 'Production Server',
            ip: '203.0.113.1',
            port: 443,
            auth: 'Bearer securetoken'
        });

        const mockResponse: CreateConnectionConfigControllerResponse = {
            success: true,
            connection: mockConnection
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(params);

        expect(result).toEqual(mockResponse);
        expect(result.success).toBe(true);
        expect(result.connection).toEqual(mockConnection);
    });

    it('should return response with error when use case fails', async () => {
        const params: CreateConnectionConfigControllerRequest = {
            name: 'Failed Connection',
            ip: 'invalid-ip',
            port: 9999
        };

        const mockResponse: CreateConnectionConfigControllerResponse = {
            success: false,
            error: 'Connection failed: invalid IP address'
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(params);

        expect(result.success).toBe(false);
        expect(result.error).toBe('Connection failed: invalid IP address');
        expect(result.connection).toBeUndefined();
    });

    it('should call logger.info exactly once', async () => {
        const params: CreateConnectionConfigControllerRequest = {
            name: 'Test',
            ip: 'localhost'
        };

        mockUseCase.execute.mockResolvedValue({ success: true });

        await controller.handle(params);

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should call use case execute exactly once', async () => {
        const params: CreateConnectionConfigControllerRequest = {
            name: 'Test',
            ip: 'localhost'
        };

        mockUseCase.execute.mockResolvedValue({ success: true });

        await controller.handle(params);

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should forward connection data correctly', async () => {
        const params: CreateConnectionConfigControllerRequest = {
            name: 'Database Server',
            ip: '172.16.0.1',
            port: 5432,
            auth: 'Basic dbauth'
        };

        const mockConnection = createConnectionHelper({
            id: 'db-conn',
            name: 'Database Server',
            ip: '172.16.0.1',
            port: 5432,
            auth: 'Basic dbauth'
        });

        mockUseCase.execute.mockResolvedValue({
            success: true,
            connection: mockConnection
        });

        const result = await controller.handle(params);

        expect(result.connection?.id).toBe('db-conn');
        expect(result.connection?.name).toBe('Database Server');
        expect(result.connection?.ip).toBe('172.16.0.1');
        expect(result.connection?.port).toBe(5432);
        expect(result.connection?.auth).toBe('Basic dbauth');
    });
});
