import { EditAssistantService } from '@application/services/assistant';
import { Assistant } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { AssistantEditParams } from '@domain/services';
import { createAssistantHelper } from '@test/helpers';

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

function createStoredAssistant (overrides?: Partial<Assistant>): Assistant {
    return createAssistantHelper({
        id: 'assistant-1',
        name: 'Local Qwen',
        observation: 'Runs on the desktop',
        modelId: 'model-1',
        samplerId: 'sampler-1',
        connectionId: 'connection-1',
        createdAt: new Date(CREATED_AT),
        updatedAt: new Date(PREVIOUS_UPDATED_AT),
        ...overrides
    });
}

function createEditParams (overrides?: Partial<AssistantEditParams>): AssistantEditParams {
    return {
        name: 'Local Qwen',
        observation: 'Runs on the desktop',
        modelId: 'model-1',
        samplerId: 'sampler-1',
        connectionId: 'connection-1',
        ...overrides
    };
}

describe('EditAssistantService', () => {
    let service: EditAssistantService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        service = new EditAssistantService(mockLogger as unknown as ILogger);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.editAssistant({ assistant: createStoredAssistant(), editParams: createEditParams() });

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditAssistantService::editAssistant');
    });

    it('should not log a warning or an error on a successful edit', () => {
        service.editAssistant({ assistant: createStoredAssistant(), editParams: createEditParams() });

        expect(mockLogger.warning).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return only success and the edited assistant with every entity field', () => {
        const editParams: Required<AssistantEditParams> = {
            name: 'Remote Qwen',
            observation: 'Runs on the server',
            modelId: 'model-2',
            samplerId: 'sampler-2',
            connectionId: 'connection-2'
        };

        const response = service.editAssistant({ assistant: createStoredAssistant(), editParams });

        expect(response).toStrictEqual({
            success: true,
            assistant: {
                ...editParams,
                id: 'assistant-1',
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should change only the name when the other fields are resent unchanged', () => {
        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: createEditParams({ name: 'Remote Qwen' })
        });

        expect(response.assistant).toEqual(createStoredAssistant({
            name: 'Remote Qwen',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the observation when the other fields are resent unchanged', () => {
        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: createEditParams({ observation: 'Runs on the server' })
        });

        expect(response.assistant).toEqual(createStoredAssistant({
            observation: 'Runs on the server',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the modelId when the other fields are resent unchanged', () => {
        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: createEditParams({ modelId: 'model-2' })
        });

        expect(response.assistant).toEqual(createStoredAssistant({
            modelId: 'model-2',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the samplerId when the other fields are resent unchanged', () => {
        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: createEditParams({ samplerId: 'sampler-2' })
        });

        expect(response.assistant).toEqual(createStoredAssistant({
            samplerId: 'sampler-2',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the connectionId when the other fields are resent unchanged', () => {
        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: createEditParams({ connectionId: 'connection-2' })
        });

        expect(response.assistant).toEqual(createStoredAssistant({
            connectionId: 'connection-2',
            updatedAt: new Date(NOW)
        }));
    });

    it('should keep the id of the assistant', () => {
        const response = service.editAssistant({
            assistant: createStoredAssistant({ id: 'assistant-42' }),
            editParams: createEditParams()
        });

        expect(response.assistant?.id).toBe('assistant-42');
    });

    it('should keep the createdAt of the assistant', () => {
        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: createEditParams()
        });

        expect(response.assistant?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an id that reaches the service inside editParams', () => {
        const editParamsWithId = { ...createEditParams(), id: 'another-assistant' };

        const response = service.editAssistant({
            assistant: createStoredAssistant({ id: 'assistant-42' }),
            editParams: editParamsWithId
        });

        expect(response.assistant?.id).toBe('assistant-42');
    });

    it('should ignore a createdAt that reaches the service inside editParams', () => {
        const editParamsWithCreatedAt = { ...createEditParams(), createdAt: new Date(NOW) };

        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: editParamsWithCreatedAt
        });

        expect(response.assistant?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an updatedAt that reaches the service inside editParams', () => {
        const editParamsWithUpdatedAt = { ...createEditParams(), updatedAt: new Date(PREVIOUS_UPDATED_AT) };

        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: editParamsWithUpdatedAt
        });

        expect(response.assistant?.updatedAt).toEqual(new Date(NOW));
    });

    it('should ignore fields that are not editable assistant fields', () => {
        const editParamsWithUnknownField = { ...createEditParams(), unknownField: 'unexpected' };

        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: editParamsWithUnknownField
        });

        expect(response.assistant).not.toHaveProperty('unknownField');
    });

    it('should clear the observation when it is sent as undefined', () => {
        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: createEditParams({ observation: undefined })
        });

        expect(response.assistant?.observation).toBeUndefined();
    });

    it('should clear the observation when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.observation;

        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: editParams
        });

        expect(response.assistant?.observation).toBeUndefined();
    });

    it('should add the observation to a assistant that had none', () => {
        const response = service.editAssistant({
            assistant: createStoredAssistant({ observation: undefined }),
            editParams: createEditParams({ observation: 'Runs on the server' })
        });

        expect(response.assistant?.observation).toEqual('Runs on the server');
    });

    it('should store an empty observation as an empty string', () => {
        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: createEditParams({ observation: '' })
        });

        expect(response.assistant?.observation).toBe('');
    });

    it('should refresh updatedAt even when no field changes', () => {
        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: createEditParams()
        });

        expect(response.assistant?.updatedAt).toEqual(new Date(NOW));
    });

    it('should keep the stored data when the whole assistant is sent with a new samplerId', () => {
        const assistant = createStoredAssistant();

        const response = service.editAssistant({
            assistant: assistant,
            editParams: { ...assistant, samplerId: 'sampler-2' }
        });

        expect(response.assistant).toEqual(createStoredAssistant({
            samplerId: 'sampler-2',
            updatedAt: new Date(NOW)
        }));
    });

    it('should return a new object instead of the given assistant', () => {
        const assistant = createStoredAssistant();

        const response = service.editAssistant({ assistant, editParams: createEditParams() });

        expect(response.assistant).not.toBe(assistant);
    });

    it('should not mutate the given assistant', () => {
        const assistant = createStoredAssistant();

        service.editAssistant({
            assistant,
            editParams: createEditParams({ name: 'Renamed', observation: undefined })
        });

        expect(assistant).toStrictEqual(createStoredAssistant());
    });

    it('should not mutate the given editParams', () => {
        const editParams = createEditParams({ name: 'Renamed' });

        service.editAssistant({ assistant: createStoredAssistant(), editParams });

        expect(editParams).toStrictEqual(createEditParams({ name: 'Renamed' }));
    });

    it('should leave blank fields to the use case validation', () => {
        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: createEditParams({ name: '', modelId: '', samplerId: '', connectionId: '' })
        });

        expect(response.success).toBe(true);
        expect(response.assistant).toEqual(expect.objectContaining({ name: '', modelId: '', samplerId: '', connectionId: '' }));
    });

    it('should trim the start and the end of the name', () => {
        const response = service.editAssistant({
            assistant: createStoredAssistant(),
            editParams: createEditParams({ name: '  Ação  🔥\n' })
        });

        expect(response.assistant?.name).toBe('Ação  🔥');
    });
});
