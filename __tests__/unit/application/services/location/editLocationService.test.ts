import { EditLocationService } from '@application/services/location';
import { Location } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { LocationEditParams } from '@domain/services';
import { createLocationHelper } from '@test/helpers';

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

function createStoredLocation (overrides?: Partial<Location>): Location {
    return createLocationHelper({
        id: 'location-1',
        name: 'Ancient Ruins',
        activationWord: 'ruins',
        prompt: 'Crumbling stone halls',
        observation: 'Haunted at night',
        createdAt: new Date(CREATED_AT),
        updatedAt: new Date(PREVIOUS_UPDATED_AT),
        ...overrides
    });
}

function createEditParams (overrides?: Partial<LocationEditParams>): LocationEditParams {
    return {
        name: 'Ancient Ruins',
        activationWord: 'ruins',
        prompt: 'Crumbling stone halls',
        observation: 'Haunted at night',
        ...overrides
    };
}

describe('EditLocationService', () => {
    let service: EditLocationService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        service = new EditLocationService(mockLogger as unknown as ILogger);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.editLocation({ location: createStoredLocation(), editParams: createEditParams() });

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditLocationService::editLocation');
    });

    it('should not log a warning or an error on a successful edit', () => {
        service.editLocation({ location: createStoredLocation(), editParams: createEditParams() });

        expect(mockLogger.warning).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return only success and the edited location with every entity field', () => {
        const editParams: Required<LocationEditParams> = {
            name: 'Sunken Temple',
            activationWord: 'temple',
            prompt: 'A flooded temple',
            observation: 'Only reachable by boat'
        };

        const response = service.editLocation({ location: createStoredLocation(), editParams });

        expect(response).toStrictEqual({
            success: true,
            location: {
                ...editParams,
                id: 'location-1',
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should change only the name when the other fields are resent unchanged', () => {
        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: createEditParams({ name: 'Sunken Temple' })
        });

        expect(response.location).toEqual(createStoredLocation({
            name: 'Sunken Temple',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the activationWord when the other fields are resent unchanged', () => {
        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: createEditParams({ activationWord: 'temple' })
        });

        expect(response.location).toEqual(createStoredLocation({
            activationWord: 'temple',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the prompt when the other fields are resent unchanged', () => {
        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: createEditParams({ prompt: 'A flooded temple' })
        });

        expect(response.location).toEqual(createStoredLocation({
            prompt: 'A flooded temple',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the observation when the other fields are resent unchanged', () => {
        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: createEditParams({ observation: 'Only reachable by boat' })
        });

        expect(response.location).toEqual(createStoredLocation({
            observation: 'Only reachable by boat',
            updatedAt: new Date(NOW)
        }));
    });

    it('should keep the id of the location', () => {
        const response = service.editLocation({
            location: createStoredLocation({ id: 'location-42' }),
            editParams: createEditParams()
        });

        expect(response.location?.id).toBe('location-42');
    });

    it('should keep the createdAt of the location', () => {
        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: createEditParams()
        });

        expect(response.location?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an id that reaches the service inside editParams', () => {
        const editParamsWithId = { ...createEditParams(), id: 'another-location' };

        const response = service.editLocation({
            location: createStoredLocation({ id: 'location-42' }),
            editParams: editParamsWithId
        });

        expect(response.location?.id).toBe('location-42');
    });

    it('should ignore a createdAt that reaches the service inside editParams', () => {
        const editParamsWithCreatedAt = { ...createEditParams(), createdAt: new Date(NOW) };

        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: editParamsWithCreatedAt
        });

        expect(response.location?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an updatedAt that reaches the service inside editParams', () => {
        const editParamsWithUpdatedAt = { ...createEditParams(), updatedAt: new Date(PREVIOUS_UPDATED_AT) };

        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: editParamsWithUpdatedAt
        });

        expect(response.location?.updatedAt).toEqual(new Date(NOW));
    });

    it('should ignore fields that are not editable location fields', () => {
        const editParamsWithUnknownField = { ...createEditParams(), unknownField: 'unexpected' };

        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: editParamsWithUnknownField
        });

        expect(response.location).not.toHaveProperty('unknownField');
    });

    it('should clear the observation when it is sent as undefined', () => {
        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: createEditParams({ observation: undefined })
        });

        expect(response.location?.observation).toBeUndefined();
    });

    it('should clear the observation when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.observation;

        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: editParams
        });

        expect(response.location?.observation).toBeUndefined();
    });

    it('should add the observation to a location that had none', () => {
        const response = service.editLocation({
            location: createStoredLocation({ observation: undefined }),
            editParams: createEditParams({ observation: 'Only reachable by boat' })
        });

        expect(response.location?.observation).toEqual('Only reachable by boat');
    });

    it('should store an empty observation as an empty string', () => {
        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: createEditParams({ observation: '' })
        });

        expect(response.location?.observation).toBe('');
    });

    it('should refresh updatedAt even when no field changes', () => {
        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: createEditParams()
        });

        expect(response.location?.updatedAt).toEqual(new Date(NOW));
    });

    it('should return a new object instead of the given location', () => {
        const location = createStoredLocation();

        const response = service.editLocation({ location, editParams: createEditParams() });

        expect(response.location).not.toBe(location);
    });

    it('should not mutate the given location', () => {
        const location = createStoredLocation();

        service.editLocation({
            location,
            editParams: createEditParams({ name: 'Renamed', observation: undefined })
        });

        expect(location).toStrictEqual(createStoredLocation());
    });

    it('should not mutate the given editParams', () => {
        const editParams = createEditParams({ name: 'Renamed' });

        service.editLocation({ location: createStoredLocation(), editParams });

        expect(editParams).toStrictEqual(createEditParams({ name: 'Renamed' }));
    });

    it('should leave blank fields to the use case validation', () => {
        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: createEditParams({ name: '', activationWord: '', prompt: '' })
        });

        expect(response.success).toBe(true);
        expect(response.location).toEqual(expect.objectContaining({ name: '', activationWord: '', prompt: '' }));
    });

    it('should trim the start and the end of the name', () => {
        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: createEditParams({ name: '  Ação  🔥\n' })
        });

        expect(response.location?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.editLocation({
            location: createStoredLocation(),
            editParams: createEditParams({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' })
        });

        expect(response.location).toEqual(expect.objectContaining({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' }));
    });
});
