import { GetConnectionsController } from '@adapters/controllers';
import { IGetConnectionsUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Connection } from '@domain/entities';
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

describe('GetConnectionsController', () => {
    let controller: GetConnectionsController;

    beforeEach(() => {
        controller = new GetConnectionsController(
            mockLogger as unknown as ILogger,
            mockUseCase as unknown as IGetConnectionsUseCase
        );
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetConnectionsController::handle');
    });

    it('should call logger.info exactly once', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should call use case execute exactly once', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should execute use case and return connections list', async () => {
        const mockConnections: Connection[] = [
            createConnectionHelper({ id: '1', name: 'Connection 1' }),
            createConnectionHelper({ id: '2', name: 'Connection 2' })
        ];

        mockUseCase.execute.mockResolvedValue(mockConnections);

        const result = await controller.handle();

        expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockConnections);
    });

    it('should return empty array when no connections exist', async () => {
        mockUseCase.execute.mockResolvedValue([]);

        const result = await controller.handle();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });

    it('should return connections list with single item', async () => {
        const mockConnections: Connection[] = [
            createConnectionHelper({ id: '1', name: 'Single Connection' })
        ];

        mockUseCase.execute.mockResolvedValue(mockConnections);

        const result = await controller.handle();

        expect(result).toEqual(mockConnections);
        expect(result.length).toBe(1);
    });

    it('should return connections with correct data', async () => {
        const mockConnections: Connection[] = [
            createConnectionHelper({
                id: 'conn-1',
                name: 'Production',
                ip: '203.0.113.1',
                port: 443,
                auth: 'Bearer prod-token'
            }),
            createConnectionHelper({
                id: 'conn-2',
                name: 'Development',
                ip: 'localhost',
                port: 3000,
                auth: 'Bearer dev-token'
            })
        ];

        mockUseCase.execute.mockResolvedValue(mockConnections);

        const result = await controller.handle();

        expect(result.length).toBe(2);
        expect(result[0].id).toBe('conn-1');
        expect(result[0].name).toBe('Production');
        expect(result[0].ip).toBe('203.0.113.1');
        expect(result[1].id).toBe('conn-2');
        expect(result[1].name).toBe('Development');
        expect(result[1].ip).toBe('localhost');
    });

    it('should handle connections with optional fields', async () => {
        const mockConnections: Connection[] = [
            createConnectionHelper({
                id: 'conn-3',
                name: 'Minimal Connection',
                ip: '10.0.0.1',
                port: undefined,
                auth: undefined
            })
        ];

        mockUseCase.execute.mockResolvedValue(mockConnections);

        const result = await controller.handle();

        expect(result.length).toBe(1);
        expect(result[0].id).toBe('conn-3');
        expect(result[0].name).toBe('Minimal Connection');
        expect(result[0].ip).toBe('10.0.0.1');
    });
});
