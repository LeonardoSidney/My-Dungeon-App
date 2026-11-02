import { EditConnectionConfigService } from '@application/services/connection';
import { Connection } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ConnectionEditParams } from '@domain/services';
import { createConnectionHelper } from '@test/helpers';

const CREATED_AT = '2026-01-10T08:00:00.000Z';
const PREVIOUS_UPDATED_AT = '2026-02-20T09:30:00.000Z';
const NOW = '2026-06-15T12:00:00.000Z';

const mockLogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

function createStoredConnection (overrides?: Partial<Connection>): Connection {
    return createConnectionHelper({
        id: 'connection-1',
        name: 'Desktop',
        ip: '192.168.0.10',
        port: 8080,
        auth: 'Bearer stored-token',
        createdAt: new Date(CREATED_AT),
        updatedAt: new Date(PREVIOUS_UPDATED_AT),
        ...overrides
    });
}

function createEditParams (overrides?: Partial<ConnectionEditParams>): ConnectionEditParams {
    return {
        name: 'Desktop',
        ip: '192.168.0.10',
        port: 8080,
        auth: 'Bearer stored-token',
        ...overrides
    };
}

describe('EditConnectionConfigService', () => {
    let service: EditConnectionConfigService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        service = new EditConnectionConfigService(mockLogger as unknown as ILogger);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.editConnectionConfig({ connection: createStoredConnection(), editParams: createEditParams() });

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditConnectionConfigService::editConnectionConfig');
    });

    it('should not log a warning or an error on a successful edit', () => {
        service.editConnectionConfig({ connection: createStoredConnection(), editParams: createEditParams() });

        expect(mockLogger.warning).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return only success and the edited connection with every entity field', () => {
        const editParams: Required<ConnectionEditParams> = {
            name: 'Server',
            ip: '10.0.0.5',
            port: 9090,
            auth: 'Bearer edited-token'
        };

        const response = service.editConnectionConfig({ connection: createStoredConnection(), editParams });

        expect(response).toStrictEqual({
            success: true,
            connection: {
                ...editParams,
                id: 'connection-1',
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should change only the name when the other fields are resent unchanged', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: createEditParams({ name: 'Server' })
        });

        expect(response.connection).toEqual(createStoredConnection({
            name: 'Server',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the ip when the other fields are resent unchanged', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: createEditParams({ ip: '10.0.0.5' })
        });

        expect(response.connection).toEqual(createStoredConnection({
            ip: '10.0.0.5',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the port when the other fields are resent unchanged', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: createEditParams({ port: 9090 })
        });

        expect(response.connection).toEqual(createStoredConnection({
            port: 9090,
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the auth when the other fields are resent unchanged', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: createEditParams({ auth: 'Bearer edited-token' })
        });

        expect(response.connection).toEqual(createStoredConnection({
            auth: 'Bearer edited-token',
            updatedAt: new Date(NOW)
        }));
    });

    it('should keep the id of the connection', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection({ id: 'connection-42' }),
            editParams: createEditParams()
        });

        expect(response.connection?.id).toBe('connection-42');
    });

    it('should keep the createdAt of the connection', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: createEditParams()
        });

        expect(response.connection?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an id that reaches the service inside editParams', () => {
        const editParamsWithId = { ...createEditParams(), id: 'another-connection' };

        const response = service.editConnectionConfig({
            connection: createStoredConnection({ id: 'connection-42' }),
            editParams: editParamsWithId
        });

        expect(response.connection?.id).toBe('connection-42');
    });

    it('should ignore a createdAt that reaches the service inside editParams', () => {
        const editParamsWithCreatedAt = { ...createEditParams(), createdAt: new Date(NOW) };

        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: editParamsWithCreatedAt
        });

        expect(response.connection?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an updatedAt that reaches the service inside editParams', () => {
        const editParamsWithUpdatedAt = { ...createEditParams(), updatedAt: new Date(PREVIOUS_UPDATED_AT) };

        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: editParamsWithUpdatedAt
        });

        expect(response.connection?.updatedAt).toEqual(new Date(NOW));
    });

    it('should ignore fields that are not editable connection fields', () => {
        const editParamsWithUnknownField = { ...createEditParams(), unknownField: 'unexpected' };

        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: editParamsWithUnknownField
        });

        expect(response.connection).not.toHaveProperty('unknownField');
    });

    it('should clear the port when it is sent as undefined', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: createEditParams({ port: undefined })
        });

        expect(response.connection?.port).toBeUndefined();
    });

    it('should clear the port when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.port;

        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: editParams
        });

        expect(response.connection?.port).toBeUndefined();
    });

    it('should add the port to a connection that had none', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection({ port: undefined }),
            editParams: createEditParams({ port: 9090 })
        });

        expect(response.connection?.port).toEqual(9090);
    });

    it('should clear the auth when it is sent as undefined', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: createEditParams({ auth: undefined })
        });

        expect(response.connection?.auth).toBeUndefined();
    });

    it('should clear the auth when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.auth;

        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: editParams
        });

        expect(response.connection?.auth).toBeUndefined();
    });

    it('should add the auth to a connection that had none', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection({ auth: undefined }),
            editParams: createEditParams({ auth: 'Bearer edited-token' })
        });

        expect(response.connection?.auth).toEqual('Bearer edited-token');
    });

    it('should store a zero port and an empty auth instead of dropping them', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: createEditParams({ port: 0, auth: '' })
        });

        expect(response.connection).toEqual(expect.objectContaining({ port: 0, auth: '' }));
    });

    it('should refresh updatedAt even when no field changes', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: createEditParams()
        });

        expect(response.connection?.updatedAt).toEqual(new Date(NOW));
    });

    it('should return a new object instead of the given connection', () => {
        const connection = createStoredConnection();

        const response = service.editConnectionConfig({ connection, editParams: createEditParams() });

        expect(response.connection).not.toBe(connection);
    });

    it('should not mutate the given connection', () => {
        const connection = createStoredConnection();

        service.editConnectionConfig({
            connection,
            editParams: createEditParams({ name: 'Renamed', port: undefined })
        });

        expect(connection).toStrictEqual(createStoredConnection());
    });

    it('should not mutate the given editParams', () => {
        const editParams = createEditParams({ name: 'Renamed' });

        service.editConnectionConfig({ connection: createStoredConnection(), editParams });

        expect(editParams).toStrictEqual(createEditParams({ name: 'Renamed' }));
    });

    it('should leave blank fields to the use case validation', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: createEditParams({ name: '', ip: '' })
        });

        expect(response.success).toBe(true);
        expect(response.connection).toEqual(expect.objectContaining({ name: '', ip: '' }));
    });

    it('should trim the start and the end of the name', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: createEditParams({ name: '  Ação  🔥\n' })
        });

        expect(response.connection?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.editConnectionConfig({
            connection: createStoredConnection(),
            editParams: createEditParams({ ip: '  Ação 🔥 0\n' })
        });

        expect(response.connection).toEqual(expect.objectContaining({ ip: '  Ação 🔥 0\n' }));
    });
});
