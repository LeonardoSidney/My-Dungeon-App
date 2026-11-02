import { EditConnectionUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IConnectionRepository } from '@domain/repository';
import { ConnectionEditParams, IEditConnectionConfigService } from '@domain/services';
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
    getConnectionById: jest.fn(),
    getConnections: jest.fn(),
    editConnection: jest.fn()
};

const mockService = {
    editConnectionConfig: jest.fn()
};

const connection = createConnectionHelper({ id: 'connection-1', name: 'Desktop' });
const editedConnection = createConnectionHelper({ id: 'connection-1', name: 'Server' });

function createEditParams (overrides?: Partial<ConnectionEditParams>): ConnectionEditParams {
    return {
        name: 'Server',
        ip: '10.0.0.5',
        port: 9090,
        auth: 'Bearer token',
        ...overrides
    };
}

function buildUseCase (): EditConnectionUseCase {
    return new EditConnectionUseCase(
        mockLogger,
        mockService as unknown as IEditConnectionConfigService,
        mockConnectionRepository as unknown as IConnectionRepository
    );
}

describe('EditConnectionUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockConnectionRepository.getConnectionById.mockResolvedValue({ success: true, connection });
        mockConnectionRepository.getConnections.mockResolvedValue({ success: true, connections: [connection] });
        mockConnectionRepository.editConnection.mockResolvedValue({ success: true });
        mockService.editConnectionConfig.mockReturnValue({ success: true, connection: editedConnection });
    });

    it('should save the edited connection and return its id', async () => {
        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams() });

        expect(mockConnectionRepository.editConnection).toHaveBeenCalledWith({ connection: editedConnection });
        expect(response).toEqual({ success: true, id: 'connection-1' });
    });

    it('should pass the stored connection and the editParams to the service', async () => {
        const editParams = createEditParams();

        await buildUseCase().execute({ id: 'connection-1', editParams });

        expect(mockService.editConnectionConfig).toHaveBeenCalledWith({ connection, editParams });
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit a connection config' });
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams({ name: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A name is required to edit a connection config' });
    });

    it('should fail when the ip is blank', async () => {
        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams({ ip: '   ' }) });

        expect(response).toEqual({ success: false, error: 'An IP is required to edit a connection config' });
    });

    it('should fail when the port is zero', async () => {
        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams({ port: 0 }) });

        expect(response).toEqual({ success: false, error: 'A valid port is required to edit a connection config' });
        expect(mockConnectionRepository.getConnectionById).not.toHaveBeenCalled();
    });

    it('should fail when the port is negative', async () => {
        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams({ port: -1 }) });

        expect(response).toEqual({ success: false, error: 'A valid port is required to edit a connection config' });
    });

    it('should fail when the port is above the highest one', async () => {
        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams({ port: 65536 }) });

        expect(response).toEqual({ success: false, error: 'A valid port is required to edit a connection config' });
    });

    it('should accept the highest port', async () => {
        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams({ port: 65535 }) });

        expect(response.success).toBe(true);
    });

    it('should accept a connection without a port', async () => {
        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams({ port: undefined }) });

        expect(response.success).toBe(true);
    });

    it('should fail when the connection cannot be loaded', async () => {
        mockConnectionRepository.getConnectionById.mockResolvedValue({ success: false, error: 'Failed to load connections' });

        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load connections' });
        expect(mockService.editConnectionConfig).not.toHaveBeenCalled();
    });

    it('should fail when the connection does not exist', async () => {
        mockConnectionRepository.getConnectionById.mockResolvedValue({ success: true, connection: undefined });

        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Connection with id connection-1 not found' });
    });

    it('should return the service error', async () => {
        mockService.editConnectionConfig.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should return a fallback error when the service fails without one', async () => {
        mockService.editConnectionConfig.mockReturnValue({ success: false });

        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on EditConnectionConfigService' });
    });

    it('should fail when the service succeeds without a connection', async () => {
        mockService.editConnectionConfig.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Success is true but does not have a connection' });
    });

    it('should fail when the connections cannot be loaded', async () => {
        mockConnectionRepository.getConnections.mockResolvedValue({ success: false, error: 'Failed to load connections' });

        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load connections' });
        expect(mockConnectionRepository.editConnection).not.toHaveBeenCalled();
    });

    it('should fail when the connections list is missing', async () => {
        mockConnectionRepository.getConnections.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams() });

        expect(response.success).toBe(false);
        expect(mockConnectionRepository.editConnection).not.toHaveBeenCalled();
    });

    it('should fail when another connection already has the edited name', async () => {
        mockConnectionRepository.getConnections.mockResolvedValue({
            success: true,
            connections: [createConnectionHelper({ id: 'connection-2', name: 'Server' })]
        });

        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Connection with name Server already exists' });
        expect(mockConnectionRepository.editConnection).not.toHaveBeenCalled();
    });

    it('should accept the name of the connection being edited', async () => {
        mockConnectionRepository.getConnections.mockResolvedValue({ success: true, connections: [editedConnection] });

        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should return the repository error when saving fails', async () => {
        mockConnectionRepository.editConnection.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when saving fails without one', async () => {
        mockConnectionRepository.editConnection.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'connection-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to edit connection' });
    });
});
