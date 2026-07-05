import { CreateConnectionConfigService } from '@application/services/connection';
import {
    CreateConnectionConfigServiceParams,
    CreateConnectionConfigServiceReturn,
    IIdGenerator
} from '@domain/services';
import { ILogger } from '@domain/logger';

// Mocks dos dependentes
const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};

const mockIdGenerator = {
    generate: jest.fn()
};

describe('CreateConnectionConfigService', () => {
    let service: CreateConnectionConfigService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new CreateConnectionConfigService(
            mockLogger as unknown as ILogger,
            mockIdGenerator as unknown as IIdGenerator
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should call logger.info when creating a connection config', () => {
        const params: CreateConnectionConfigServiceParams = {
            name: 'Test Connection',
            ip: 'localhost',
            port: 8080,
            auth: 'Bearer token'
        };

        mockIdGenerator.generate.mockReturnValue('conn-123');

        service.createConnectionConfig(params);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateConnectionConfigService::createConnectionConfig');
    });

    it('should call idGenerator.generate to create connection id', () => {
        const params: CreateConnectionConfigServiceParams = {
            name: 'Test Connection',
            ip: 'localhost',
            port: 8080,
            auth: 'Bearer token'
        };

        mockIdGenerator.generate.mockReturnValue('conn-456');

        service.createConnectionConfig(params);

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return success: true when connection config is created', () => {
        const params: CreateConnectionConfigServiceParams = {
            name: 'Test Connection',
            ip: 'localhost',
            port: 8080,
            auth: 'Bearer token'
        };

        mockIdGenerator.generate.mockReturnValue('conn-789');

        const result: CreateConnectionConfigServiceReturn = service.createConnectionConfig(params);

        expect(result.success).toBe(true);
    });

    it('should return connection with correct id', () => {
        const params: CreateConnectionConfigServiceParams = {
            name: 'Test Connection',
            ip: 'localhost',
            port: 8080,
            auth: 'Bearer token'
        };

        mockIdGenerator.generate.mockReturnValue('conn-101');

        const result: CreateConnectionConfigServiceReturn = service.createConnectionConfig(params);

        expect(result.connection?.id).toBe('conn-101');
    });

    it('should return connection with correct name', () => {
        const params: CreateConnectionConfigServiceParams = {
            name: 'My Production DB',
            ip: '192.168.1.100',
            port: 5432,
            auth: 'Bearer secret-token'
        };

        mockIdGenerator.generate.mockReturnValue('conn-102');

        const result: CreateConnectionConfigServiceReturn = service.createConnectionConfig(params);

        expect(result.connection?.name).toBe('My Production DB');
    });

    it('should return connection with correct ip', () => {
        const params: CreateConnectionConfigServiceParams = {
            name: 'Staging Server',
            ip: '10.0.0.50',
            port: 3000
        };

        mockIdGenerator.generate.mockReturnValue('conn-103');

        const result: CreateConnectionConfigServiceReturn = service.createConnectionConfig(params);

        expect(result.connection?.ip).toBe('10.0.0.50');
    });

    it('should return connection with correct port', () => {
        const params: CreateConnectionConfigServiceParams = {
            name: 'API Gateway',
            ip: 'api.example.com',
            port: 443
        };

        mockIdGenerator.generate.mockReturnValue('conn-104');

        const result: CreateConnectionConfigServiceReturn = service.createConnectionConfig(params);

        expect(result.connection?.port).toBe(443);
    });

    it('should return connection with correct auth', () => {
        const params: CreateConnectionConfigServiceParams = {
            name: 'Secure Connection',
            ip: 'secure.example.com',
            port: 8443,
            auth: 'Bearer my-auth-token'
        };

        mockIdGenerator.generate.mockReturnValue('conn-105');

        const result: CreateConnectionConfigServiceReturn = service.createConnectionConfig(params);

        expect(result.connection?.auth).toBe('Bearer my-auth-token');
    });

    it('should return connection with createdAt and updatedAt as Date objects', () => {
        const params: CreateConnectionConfigServiceParams = {
            name: 'Test Connection',
            ip: 'localhost',
            port: 8080
        };

        mockIdGenerator.generate.mockReturnValue('conn-106');

        const result: CreateConnectionConfigServiceReturn = service.createConnectionConfig(params);

        expect(result.connection?.createdAt).toBeInstanceOf(Date);
        expect(result.connection?.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle optional port and auth fields', () => {
        const params: CreateConnectionConfigServiceParams = {
            name: 'Minimal Connection',
            ip: 'localhost'
        };

        mockIdGenerator.generate.mockReturnValue('conn-107');

        const result: CreateConnectionConfigServiceReturn = service.createConnectionConfig(params);

        expect(result.success).toBe(true);
        expect(result.connection?.name).toBe('Minimal Connection');
        expect(result.connection?.ip).toBe('localhost');
        expect(result.connection?.port).toBeUndefined();
        expect(result.connection?.auth).toBeUndefined();
    });
});
