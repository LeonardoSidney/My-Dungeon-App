import { EditStatusService } from '@application/services/status';
import { Status } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { StatusEditParams } from '@domain/services';
import { createStatusHelper } from '@test/helpers';

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

function createStoredStatus (overrides?: Partial<Status>): Status {
    return createStatusHelper({
        id: 'status-1',
        name: 'Blessed',
        activationWord: 'blessing',
        prompt: 'Protected by the gods',
        observation: 'Lasts until dawn',
        createdAt: new Date(CREATED_AT),
        updatedAt: new Date(PREVIOUS_UPDATED_AT),
        ...overrides
    });
}

function createEditParams (overrides?: Partial<StatusEditParams>): StatusEditParams {
    return {
        name: 'Blessed',
        activationWord: 'blessing',
        prompt: 'Protected by the gods',
        observation: 'Lasts until dawn',
        ...overrides
    };
}

describe('EditStatusService', () => {
    let service: EditStatusService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        service = new EditStatusService(mockLogger as unknown as ILogger);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.editStatus({ status: createStoredStatus(), editParams: createEditParams() });

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditStatusService::editStatus');
    });

    it('should not log a warning or an error on a successful edit', () => {
        service.editStatus({ status: createStoredStatus(), editParams: createEditParams() });

        expect(mockLogger.warning).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return only success and the edited status with every entity field', () => {
        const editParams: Required<StatusEditParams> = {
            name: 'Poisoned',
            activationWord: 'poison',
            prompt: 'Weakened by venom',
            observation: 'Lasts three days'
        };

        const response = service.editStatus({ status: createStoredStatus(), editParams });

        expect(response).toStrictEqual({
            success: true,
            status: {
                ...editParams,
                id: 'status-1',
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should change only the name when the other fields are resent unchanged', () => {
        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: createEditParams({ name: 'Poisoned' })
        });

        expect(response.status).toEqual(createStoredStatus({
            name: 'Poisoned',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the activationWord when the other fields are resent unchanged', () => {
        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: createEditParams({ activationWord: 'poison' })
        });

        expect(response.status).toEqual(createStoredStatus({
            activationWord: 'poison',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the prompt when the other fields are resent unchanged', () => {
        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: createEditParams({ prompt: 'Weakened by venom' })
        });

        expect(response.status).toEqual(createStoredStatus({
            prompt: 'Weakened by venom',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the observation when the other fields are resent unchanged', () => {
        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: createEditParams({ observation: 'Lasts three days' })
        });

        expect(response.status).toEqual(createStoredStatus({
            observation: 'Lasts three days',
            updatedAt: new Date(NOW)
        }));
    });

    it('should keep the id of the status', () => {
        const response = service.editStatus({
            status: createStoredStatus({ id: 'status-42' }),
            editParams: createEditParams()
        });

        expect(response.status?.id).toBe('status-42');
    });

    it('should keep the createdAt of the status', () => {
        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: createEditParams()
        });

        expect(response.status?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an id that reaches the service inside editParams', () => {
        const editParamsWithId = { ...createEditParams(), id: 'another-status' };

        const response = service.editStatus({
            status: createStoredStatus({ id: 'status-42' }),
            editParams: editParamsWithId
        });

        expect(response.status?.id).toBe('status-42');
    });

    it('should ignore a createdAt that reaches the service inside editParams', () => {
        const editParamsWithCreatedAt = { ...createEditParams(), createdAt: new Date(NOW) };

        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: editParamsWithCreatedAt
        });

        expect(response.status?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an updatedAt that reaches the service inside editParams', () => {
        const editParamsWithUpdatedAt = { ...createEditParams(), updatedAt: new Date(PREVIOUS_UPDATED_AT) };

        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: editParamsWithUpdatedAt
        });

        expect(response.status?.updatedAt).toEqual(new Date(NOW));
    });

    it('should ignore fields that are not editable status fields', () => {
        const editParamsWithUnknownField = { ...createEditParams(), unknownField: 'unexpected' };

        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: editParamsWithUnknownField
        });

        expect(response.status).not.toHaveProperty('unknownField');
    });

    it('should clear the observation when it is sent as undefined', () => {
        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: createEditParams({ observation: undefined })
        });

        expect(response.status?.observation).toBeUndefined();
    });

    it('should clear the observation when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.observation;

        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: editParams
        });

        expect(response.status?.observation).toBeUndefined();
    });

    it('should add the observation to a status that had none', () => {
        const response = service.editStatus({
            status: createStoredStatus({ observation: undefined }),
            editParams: createEditParams({ observation: 'Lasts three days' })
        });

        expect(response.status?.observation).toEqual('Lasts three days');
    });

    it('should store an empty observation as an empty string', () => {
        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: createEditParams({ observation: '' })
        });

        expect(response.status?.observation).toBe('');
    });

    it('should refresh updatedAt even when no field changes', () => {
        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: createEditParams()
        });

        expect(response.status?.updatedAt).toEqual(new Date(NOW));
    });

    it('should return a new object instead of the given status', () => {
        const status = createStoredStatus();

        const response = service.editStatus({ status, editParams: createEditParams() });

        expect(response.status).not.toBe(status);
    });

    it('should not mutate the given status', () => {
        const status = createStoredStatus();

        service.editStatus({
            status,
            editParams: createEditParams({ name: 'Renamed', observation: undefined })
        });

        expect(status).toStrictEqual(createStoredStatus());
    });

    it('should not mutate the given editParams', () => {
        const editParams = createEditParams({ name: 'Renamed' });

        service.editStatus({ status: createStoredStatus(), editParams });

        expect(editParams).toStrictEqual(createEditParams({ name: 'Renamed' }));
    });

    it('should leave blank fields to the use case validation', () => {
        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: createEditParams({ name: '', activationWord: '', prompt: '' })
        });

        expect(response.success).toBe(true);
        expect(response.status).toEqual(expect.objectContaining({ name: '', activationWord: '', prompt: '' }));
    });

    it('should trim the start and the end of the name', () => {
        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: createEditParams({ name: '  Ação  🔥\n' })
        });

        expect(response.status?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.editStatus({
            status: createStoredStatus(),
            editParams: createEditParams({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' })
        });

        expect(response.status).toEqual(expect.objectContaining({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' }));
    });
});
