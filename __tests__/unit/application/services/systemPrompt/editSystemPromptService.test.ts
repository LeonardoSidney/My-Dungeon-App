import { EditSystemPromptService } from '@application/services/systemPrompt';
import { SystemPrompt } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { SystemPromptEditParams } from '@domain/services';
import { createSystemPromptHelper } from '@test/helpers';

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

function createStoredSystemPrompt (overrides?: Partial<SystemPrompt>): SystemPrompt {
    return createSystemPromptHelper({
        id: 'systemPrompt-1',
        name: 'Narrator Rules',
        content: 'Always narrate in third person',
        observation: 'Used by every adventure',
        createdAt: new Date(CREATED_AT),
        updatedAt: new Date(PREVIOUS_UPDATED_AT),
        ...overrides
    });
}

function createEditParams (overrides?: Partial<SystemPromptEditParams>): SystemPromptEditParams {
    return {
        name: 'Narrator Rules',
        content: 'Always narrate in third person',
        observation: 'Used by every adventure',
        ...overrides
    };
}

describe('EditSystemPromptService', () => {
    let service: EditSystemPromptService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        service = new EditSystemPromptService(mockLogger as unknown as ILogger);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.editSystemPrompt({ systemPrompt: createStoredSystemPrompt(), editParams: createEditParams() });

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditSystemPromptService::editSystemPrompt');
    });

    it('should not log a warning or an error on a successful edit', () => {
        service.editSystemPrompt({ systemPrompt: createStoredSystemPrompt(), editParams: createEditParams() });

        expect(mockLogger.warning).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return only success and the edited system prompt with every entity field', () => {
        const editParams: Required<SystemPromptEditParams> = {
            name: 'Combat Rules',
            content: 'Describe every attack',
            observation: 'Used in battles'
        };

        const response = service.editSystemPrompt({ systemPrompt: createStoredSystemPrompt(), editParams });

        expect(response).toStrictEqual({
            success: true,
            systemPrompt: {
                ...editParams,
                id: 'systemPrompt-1',
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should change only the name when the other fields are resent unchanged', () => {
        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: createEditParams({ name: 'Combat Rules' })
        });

        expect(response.systemPrompt).toEqual(createStoredSystemPrompt({
            name: 'Combat Rules',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the content when the other fields are resent unchanged', () => {
        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: createEditParams({ content: 'Describe every attack' })
        });

        expect(response.systemPrompt).toEqual(createStoredSystemPrompt({
            content: 'Describe every attack',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the observation when the other fields are resent unchanged', () => {
        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: createEditParams({ observation: 'Used in battles' })
        });

        expect(response.systemPrompt).toEqual(createStoredSystemPrompt({
            observation: 'Used in battles',
            updatedAt: new Date(NOW)
        }));
    });

    it('should keep the id of the system prompt', () => {
        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt({ id: 'systemPrompt-42' }),
            editParams: createEditParams()
        });

        expect(response.systemPrompt?.id).toBe('systemPrompt-42');
    });

    it('should keep the createdAt of the system prompt', () => {
        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: createEditParams()
        });

        expect(response.systemPrompt?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an id that reaches the service inside editParams', () => {
        const editParamsWithId = { ...createEditParams(), id: 'another-systemPrompt' };

        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt({ id: 'systemPrompt-42' }),
            editParams: editParamsWithId
        });

        expect(response.systemPrompt?.id).toBe('systemPrompt-42');
    });

    it('should ignore a createdAt that reaches the service inside editParams', () => {
        const editParamsWithCreatedAt = { ...createEditParams(), createdAt: new Date(NOW) };

        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: editParamsWithCreatedAt
        });

        expect(response.systemPrompt?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an updatedAt that reaches the service inside editParams', () => {
        const editParamsWithUpdatedAt = { ...createEditParams(), updatedAt: new Date(PREVIOUS_UPDATED_AT) };

        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: editParamsWithUpdatedAt
        });

        expect(response.systemPrompt?.updatedAt).toEqual(new Date(NOW));
    });

    it('should ignore fields that are not editable system prompt fields', () => {
        const editParamsWithUnknownField = { ...createEditParams(), unknownField: 'unexpected' };

        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: editParamsWithUnknownField
        });

        expect(response.systemPrompt).not.toHaveProperty('unknownField');
    });

    it('should clear the observation when it is sent as undefined', () => {
        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: createEditParams({ observation: undefined })
        });

        expect(response.systemPrompt?.observation).toBeUndefined();
    });

    it('should clear the observation when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.observation;

        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: editParams
        });

        expect(response.systemPrompt?.observation).toBeUndefined();
    });

    it('should add the observation to a system prompt that had none', () => {
        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt({ observation: undefined }),
            editParams: createEditParams({ observation: 'Used in battles' })
        });

        expect(response.systemPrompt?.observation).toEqual('Used in battles');
    });

    it('should store an empty observation as an empty string', () => {
        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: createEditParams({ observation: '' })
        });

        expect(response.systemPrompt?.observation).toBe('');
    });

    it('should refresh updatedAt even when no field changes', () => {
        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: createEditParams()
        });

        expect(response.systemPrompt?.updatedAt).toEqual(new Date(NOW));
    });

    it('should return a new object instead of the given system prompt', () => {
        const systemPrompt = createStoredSystemPrompt();

        const response = service.editSystemPrompt({ systemPrompt, editParams: createEditParams() });

        expect(response.systemPrompt).not.toBe(systemPrompt);
    });

    it('should not mutate the given system prompt', () => {
        const systemPrompt = createStoredSystemPrompt();

        service.editSystemPrompt({
            systemPrompt,
            editParams: createEditParams({ name: 'Renamed', observation: undefined })
        });

        expect(systemPrompt).toStrictEqual(createStoredSystemPrompt());
    });

    it('should not mutate the given editParams', () => {
        const editParams = createEditParams({ name: 'Renamed' });

        service.editSystemPrompt({ systemPrompt: createStoredSystemPrompt(), editParams });

        expect(editParams).toStrictEqual(createEditParams({ name: 'Renamed' }));
    });

    it('should leave blank fields to the use case validation', () => {
        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: createEditParams({ name: '', content: '' })
        });

        expect(response.success).toBe(true);
        expect(response.systemPrompt).toEqual(expect.objectContaining({ name: '', content: '' }));
    });

    it('should trim the start and the end of the name', () => {
        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: createEditParams({ name: '  Ação  🔥\n' })
        });

        expect(response.systemPrompt?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.editSystemPrompt({
            systemPrompt: createStoredSystemPrompt(),
            editParams: createEditParams({ content: '  Ação 🔥 0\n' })
        });

        expect(response.systemPrompt).toEqual(expect.objectContaining({ content: '  Ação 🔥 0\n' }));
    });
});
