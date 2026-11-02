import { EditWorldMasterService } from '@application/services/worldMaster';
import { WorldMaster } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { WorldMasterEditParams } from '@domain/services';
import { createWorldMasterHelper } from '@test/helpers';

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

function createStoredWorldMaster (overrides?: Partial<WorldMaster>): WorldMaster {
    return createWorldMasterHelper({
        id: 'worldMaster-1',
        name: 'Dungeon Keeper',
        activationWord: 'keeper',
        prompt: 'Narrate the dungeon',
        observation: 'Prefers dark stories',
        assistantId: 'assistant-1',
        createdAt: new Date(CREATED_AT),
        updatedAt: new Date(PREVIOUS_UPDATED_AT),
        ...overrides
    });
}

function createEditParams (overrides?: Partial<WorldMasterEditParams>): WorldMasterEditParams {
    return {
        name: 'Dungeon Keeper',
        activationWord: 'keeper',
        prompt: 'Narrate the dungeon',
        observation: 'Prefers dark stories',
        assistantId: 'assistant-1',
        ...overrides
    };
}

describe('EditWorldMasterService', () => {
    let service: EditWorldMasterService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        service = new EditWorldMasterService(mockLogger as unknown as ILogger);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.editWorldMaster({ worldMaster: createStoredWorldMaster(), editParams: createEditParams() });

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditWorldMasterService::editWorldMaster');
    });

    it('should not log a warning or an error on a successful edit', () => {
        service.editWorldMaster({ worldMaster: createStoredWorldMaster(), editParams: createEditParams() });

        expect(mockLogger.warning).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return only success and the edited world master with every entity field', () => {
        const editParams: Required<WorldMasterEditParams> = {
            name: 'Sky Warden',
            activationWord: 'warden',
            prompt: 'Narrate the skies',
            observation: 'Prefers light stories',
            assistantId: 'assistant-2'
        };

        const response = service.editWorldMaster({ worldMaster: createStoredWorldMaster(), editParams });

        expect(response).toStrictEqual({
            success: true,
            worldMaster: {
                ...editParams,
                id: 'worldMaster-1',
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should change only the name when the other fields are resent unchanged', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: createEditParams({ name: 'Sky Warden' })
        });

        expect(response.worldMaster).toEqual(createStoredWorldMaster({
            name: 'Sky Warden',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the activationWord when the other fields are resent unchanged', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: createEditParams({ activationWord: 'warden' })
        });

        expect(response.worldMaster).toEqual(createStoredWorldMaster({
            activationWord: 'warden',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the prompt when the other fields are resent unchanged', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: createEditParams({ prompt: 'Narrate the skies' })
        });

        expect(response.worldMaster).toEqual(createStoredWorldMaster({
            prompt: 'Narrate the skies',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the observation when the other fields are resent unchanged', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: createEditParams({ observation: 'Prefers light stories' })
        });

        expect(response.worldMaster).toEqual(createStoredWorldMaster({
            observation: 'Prefers light stories',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the assistantId when the other fields are resent unchanged', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: createEditParams({ assistantId: 'assistant-2' })
        });

        expect(response.worldMaster).toEqual(createStoredWorldMaster({
            assistantId: 'assistant-2',
            updatedAt: new Date(NOW)
        }));
    });

    it('should keep the id of the world master', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster({ id: 'worldMaster-42' }),
            editParams: createEditParams()
        });

        expect(response.worldMaster?.id).toBe('worldMaster-42');
    });

    it('should keep the createdAt of the world master', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: createEditParams()
        });

        expect(response.worldMaster?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an id that reaches the service inside editParams', () => {
        const editParamsWithId = { ...createEditParams(), id: 'another-worldMaster' };

        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster({ id: 'worldMaster-42' }),
            editParams: editParamsWithId
        });

        expect(response.worldMaster?.id).toBe('worldMaster-42');
    });

    it('should ignore a createdAt that reaches the service inside editParams', () => {
        const editParamsWithCreatedAt = { ...createEditParams(), createdAt: new Date(NOW) };

        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: editParamsWithCreatedAt
        });

        expect(response.worldMaster?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an updatedAt that reaches the service inside editParams', () => {
        const editParamsWithUpdatedAt = { ...createEditParams(), updatedAt: new Date(PREVIOUS_UPDATED_AT) };

        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: editParamsWithUpdatedAt
        });

        expect(response.worldMaster?.updatedAt).toEqual(new Date(NOW));
    });

    it('should ignore fields that are not editable world master fields', () => {
        const editParamsWithUnknownField = { ...createEditParams(), unknownField: 'unexpected' };

        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: editParamsWithUnknownField
        });

        expect(response.worldMaster).not.toHaveProperty('unknownField');
    });

    it('should clear the observation when it is sent as undefined', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: createEditParams({ observation: undefined })
        });

        expect(response.worldMaster?.observation).toBeUndefined();
    });

    it('should clear the observation when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.observation;

        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: editParams
        });

        expect(response.worldMaster?.observation).toBeUndefined();
    });

    it('should add the observation to a world master that had none', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster({ observation: undefined }),
            editParams: createEditParams({ observation: 'Prefers light stories' })
        });

        expect(response.worldMaster?.observation).toEqual('Prefers light stories');
    });

    it('should store an empty observation as an empty string', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: createEditParams({ observation: '' })
        });

        expect(response.worldMaster?.observation).toBe('');
    });

    it('should refresh updatedAt even when no field changes', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: createEditParams()
        });

        expect(response.worldMaster?.updatedAt).toEqual(new Date(NOW));
    });

    it('should keep the stored data when the whole world master is sent with a new assistantId', () => {
        const worldMaster = createStoredWorldMaster();

        const response = service.editWorldMaster({
            worldMaster: worldMaster,
            editParams: { ...worldMaster, assistantId: 'assistant-2' }
        });

        expect(response.worldMaster).toEqual(createStoredWorldMaster({
            assistantId: 'assistant-2',
            updatedAt: new Date(NOW)
        }));
    });

    it('should return a new object instead of the given world master', () => {
        const worldMaster = createStoredWorldMaster();

        const response = service.editWorldMaster({ worldMaster, editParams: createEditParams() });

        expect(response.worldMaster).not.toBe(worldMaster);
    });

    it('should not mutate the given world master', () => {
        const worldMaster = createStoredWorldMaster();

        service.editWorldMaster({
            worldMaster,
            editParams: createEditParams({ name: 'Renamed', observation: undefined })
        });

        expect(worldMaster).toStrictEqual(createStoredWorldMaster());
    });

    it('should not mutate the given editParams', () => {
        const editParams = createEditParams({ name: 'Renamed' });

        service.editWorldMaster({ worldMaster: createStoredWorldMaster(), editParams });

        expect(editParams).toStrictEqual(createEditParams({ name: 'Renamed' }));
    });

    it('should leave blank fields to the use case validation', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: createEditParams({ name: '', activationWord: '', prompt: '', assistantId: '' })
        });

        expect(response.success).toBe(true);
        expect(response.worldMaster).toEqual(expect.objectContaining({ name: '', activationWord: '', prompt: '', assistantId: '' }));
    });

    it('should trim the start and the end of the name', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: createEditParams({ name: '  Ação  🔥\n' })
        });

        expect(response.worldMaster?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.editWorldMaster({
            worldMaster: createStoredWorldMaster(),
            editParams: createEditParams({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' })
        });

        expect(response.worldMaster).toEqual(expect.objectContaining({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' }));
    });
});
