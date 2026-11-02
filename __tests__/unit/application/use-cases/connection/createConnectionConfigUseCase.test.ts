import { CreateConnectionConfigUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IConnectionRepository } from '@domain/repository';
import { ICreateConnectionConfigService } from '@domain/services';
import { CreateConnectionConfigParams } from '@domain/use-cases';
import { createConnectionHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockConnectionRepository = {
    getConnections: jest.fn(),
    saveConnection: jest.fn()
};

const mockService = {
    createConnectionConfig: jest.fn()
};

const createdConnection = createConnectionHelper({ id: 'connection-1', name: 'Desktop' });

function createParams (overrides?: Partial<CreateConnectionConfigParams>): CreateConnectionConfigParams {
    return {
        name: 'Desktop',
        ip: '192.168.0.10',
        port: 8080,
        auth: 'Bearer token',
        ...overrides
    };
}

function buildUseCase (): CreateConnectionConfigUseCase {
    return new CreateConnectionConfigUseCase(
        mockLogger,
        mockService as unknown as ICreateConnectionConfigService,
        mockConnectionRepository as unknown as IConnectionRepository
    );
}

describe('CreateConnectionConfigUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockConnectionRepository.getConnections.mockResolvedValue({ success: true, connections: [] });
        mockConnectionRepository.saveConnection.mockResolvedValue({ success: true });
        mockService.createConnectionConfig.mockReturnValue({ success: true, connection: createdConnection });
    });

    it('should save the created connection and return its id', async () => {
        const response = await buildUseCase().execute(createParams());

        expect(mockConnectionRepository.saveConnection).toHaveBeenCalledWith({ connection: createdConnection });
        expect(response).toEqual({ success: true, id: 'connection-1' });
    });

    it('should pass only the connection fields to the service', async () => {
        await buildUseCase().execute({ ...createParams(), id: 'ignored' } as CreateConnectionConfigParams);

        expect(mockService.createConnectionConfig).toHaveBeenCalledWith(createParams());
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute(createParams({ name: '   ' }));

        expect(response).toEqual({ success: false, error: 'A name is required to create a connection config' });
    });

    it('should fail when the ip is blank', async () => {
        const response = await buildUseCase().execute(createParams({ ip: '   ' }));

        expect(response).toEqual({ success: false, error: 'An IP is required to create a connection config' });
    });

    it('should fail when the port is zero', async () => {
        const response = await buildUseCase().execute(createParams({ port: 0 }));

        expect(response).toEqual({ success: false, error: 'A valid port is required to create a connection config' });
        expect(mockService.createConnectionConfig).not.toHaveBeenCalled();
    });

    it('should fail when the port is negative', async () => {
        const response = await buildUseCase().execute(createParams({ port: -1 }));

        expect(response).toEqual({ success: false, error: 'A valid port is required to create a connection config' });
    });

    it('should fail when the port is above the highest one', async () => {
        const response = await buildUseCase().execute(createParams({ port: 65536 }));

        expect(response).toEqual({ success: false, error: 'A valid port is required to create a connection config' });
    });

    it('should accept the highest port', async () => {
        const response = await buildUseCase().execute(createParams({ port: 65535 }));

        expect(response.success).toBe(true);
    });

    it('should accept a connection without a port', async () => {
        const response = await buildUseCase().execute(createParams({ port: undefined }));

        expect(response.success).toBe(true);
    });

    it('should return the service error', async () => {
        mockService.createConnectionConfig.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should return a fallback error when the service fails without one', async () => {
        mockService.createConnectionConfig.mockReturnValue({ success: false });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on CreateConnectionConfigService' });
    });

    it('should fail when the service succeeds without a connection', async () => {
        mockService.createConnectionConfig.mockReturnValue({ success: true });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Success is true but does not have a connection' });
    });

    it('should fail when the connections cannot be loaded', async () => {
        mockConnectionRepository.getConnections.mockResolvedValue({ success: false, error: 'Failed to load connections' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Failed to load connections' });
        expect(mockConnectionRepository.saveConnection).not.toHaveBeenCalled();
    });

    it('should fail when the connections list is missing', async () => {
        mockConnectionRepository.getConnections.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute(createParams());

        expect(response.success).toBe(false);
        expect(mockConnectionRepository.saveConnection).not.toHaveBeenCalled();
    });

    it('should fail when a connection with the same name already exists', async () => {
        mockConnectionRepository.getConnections.mockResolvedValue({
            success: true,
            connections: [createConnectionHelper({ id: 'connection-2', name: 'Desktop' })]
        });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Connection with name Desktop already exists' });
        expect(mockConnectionRepository.saveConnection).not.toHaveBeenCalled();
    });

    it('should return the repository error when saving fails', async () => {
        mockConnectionRepository.saveConnection.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });
});
