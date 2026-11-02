import { EditWorldService } from '@application/services/world';
import { World } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { WorldEditParams } from '@domain/services';
import { createWorldHelper } from '@test/helpers';

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

function createStoredWorld (overrides?: Partial<World>): World {
    return createWorldHelper({
        id: 'world-1',
        name: 'Fantasy World',
        activationWord: 'dungeon',
        prompt: 'A land of magic',
        observation: 'Medieval setting',
        createdAt: new Date(CREATED_AT),
        updatedAt: new Date(PREVIOUS_UPDATED_AT),
        ...overrides
    });
}

function createEditParams (overrides?: Partial<WorldEditParams>): WorldEditParams {
    return {
        name: 'Fantasy World',
        activationWord: 'dungeon',
        prompt: 'A land of magic',
        observation: 'Medieval setting',
        ...overrides
    };
}

describe('EditWorldService', () => {
    let service: EditWorldService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        service = new EditWorldService(mockLogger as unknown as ILogger);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.editWorld({ world: createStoredWorld(), editParams: createEditParams() });

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditWorldService::editWorld');
    });

    it('should not log a warning or an error on a successful edit', () => {
        service.editWorld({ world: createStoredWorld(), editParams: createEditParams() });

        expect(mockLogger.warning).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return only success and the edited world with every entity field', () => {
        const editParams: Required<WorldEditParams> = {
            name: 'Space Colony',
            activationWord: 'station',
            prompt: 'A distant colony',
            observation: 'Futuristic setting'
        };

        const response = service.editWorld({ world: createStoredWorld(), editParams });

        expect(response).toStrictEqual({
            success: true,
            world: {
                ...editParams,
                id: 'world-1',
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should change only the name when the other fields are resent unchanged', () => {
        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: createEditParams({ name: 'Space Colony' })
        });

        expect(response.world).toEqual(createStoredWorld({
            name: 'Space Colony',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the activationWord when the other fields are resent unchanged', () => {
        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: createEditParams({ activationWord: 'station' })
        });

        expect(response.world).toEqual(createStoredWorld({
            activationWord: 'station',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the prompt when the other fields are resent unchanged', () => {
        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: createEditParams({ prompt: 'A distant colony' })
        });

        expect(response.world).toEqual(createStoredWorld({
            prompt: 'A distant colony',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the observation when the other fields are resent unchanged', () => {
        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: createEditParams({ observation: 'Futuristic setting' })
        });

        expect(response.world).toEqual(createStoredWorld({
            observation: 'Futuristic setting',
            updatedAt: new Date(NOW)
        }));
    });

    it('should keep the id of the world', () => {
        const response = service.editWorld({
            world: createStoredWorld({ id: 'world-42' }),
            editParams: createEditParams()
        });

        expect(response.world?.id).toBe('world-42');
    });

    it('should keep the createdAt of the world', () => {
        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: createEditParams()
        });

        expect(response.world?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an id that reaches the service inside editParams', () => {
        const editParamsWithId = { ...createEditParams(), id: 'another-world' };

        const response = service.editWorld({
            world: createStoredWorld({ id: 'world-42' }),
            editParams: editParamsWithId
        });

        expect(response.world?.id).toBe('world-42');
    });

    it('should ignore a createdAt that reaches the service inside editParams', () => {
        const editParamsWithCreatedAt = { ...createEditParams(), createdAt: new Date(NOW) };

        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: editParamsWithCreatedAt
        });

        expect(response.world?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an updatedAt that reaches the service inside editParams', () => {
        const editParamsWithUpdatedAt = { ...createEditParams(), updatedAt: new Date(PREVIOUS_UPDATED_AT) };

        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: editParamsWithUpdatedAt
        });

        expect(response.world?.updatedAt).toEqual(new Date(NOW));
    });

    it('should ignore fields that are not editable world fields', () => {
        const editParamsWithUnknownField = { ...createEditParams(), unknownField: 'unexpected' };

        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: editParamsWithUnknownField
        });

        expect(response.world).not.toHaveProperty('unknownField');
    });

    it('should clear the observation when it is sent as undefined', () => {
        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: createEditParams({ observation: undefined })
        });

        expect(response.world?.observation).toBeUndefined();
    });

    it('should clear the observation when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.observation;

        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: editParams
        });

        expect(response.world?.observation).toBeUndefined();
    });

    it('should add the observation to a world that had none', () => {
        const response = service.editWorld({
            world: createStoredWorld({ observation: undefined }),
            editParams: createEditParams({ observation: 'Futuristic setting' })
        });

        expect(response.world?.observation).toEqual('Futuristic setting');
    });

    it('should store an empty observation as an empty string', () => {
        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: createEditParams({ observation: '' })
        });

        expect(response.world?.observation).toBe('');
    });

    it('should refresh updatedAt even when no field changes', () => {
        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: createEditParams()
        });

        expect(response.world?.updatedAt).toEqual(new Date(NOW));
    });

    it('should return a new object instead of the given world', () => {
        const world = createStoredWorld();

        const response = service.editWorld({ world, editParams: createEditParams() });

        expect(response.world).not.toBe(world);
    });

    it('should not mutate the given world', () => {
        const world = createStoredWorld();

        service.editWorld({
            world,
            editParams: createEditParams({ name: 'Renamed', observation: undefined })
        });

        expect(world).toStrictEqual(createStoredWorld());
    });

    it('should not mutate the given editParams', () => {
        const editParams = createEditParams({ name: 'Renamed' });

        service.editWorld({ world: createStoredWorld(), editParams });

        expect(editParams).toStrictEqual(createEditParams({ name: 'Renamed' }));
    });

    it('should leave blank fields to the use case validation', () => {
        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: createEditParams({ name: '', activationWord: '', prompt: '' })
        });

        expect(response.success).toBe(true);
        expect(response.world).toEqual(expect.objectContaining({ name: '', activationWord: '', prompt: '' }));
    });

    it('should trim the start and the end of the name', () => {
        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: createEditParams({ name: '  Ação  🔥\n' })
        });

        expect(response.world?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.editWorld({
            world: createStoredWorld(),
            editParams: createEditParams({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' })
        });

        expect(response.world).toEqual(expect.objectContaining({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' }));
    });
});
