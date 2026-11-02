import { EditProficiencyService } from '@application/services/proficiency';
import { Proficiency } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ProficiencyEditParams } from '@domain/services';
import { createProficiencyHelper } from '@test/helpers';

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

function createStoredProficiency (overrides?: Partial<Proficiency>): Proficiency {
    return createProficiencyHelper({
        id: 'proficiency-1',
        name: 'Swordsmanship',
        activationWord: 'sword',
        prompt: 'Trained with blades',
        observation: 'Learned as a squire',
        createdAt: new Date(CREATED_AT),
        updatedAt: new Date(PREVIOUS_UPDATED_AT),
        ...overrides
    });
}

function createEditParams (overrides?: Partial<ProficiencyEditParams>): ProficiencyEditParams {
    return {
        name: 'Swordsmanship',
        activationWord: 'sword',
        prompt: 'Trained with blades',
        observation: 'Learned as a squire',
        ...overrides
    };
}

describe('EditProficiencyService', () => {
    let service: EditProficiencyService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        service = new EditProficiencyService(mockLogger as unknown as ILogger);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.editProficiency({ proficiency: createStoredProficiency(), editParams: createEditParams() });

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditProficiencyService::editProficiency');
    });

    it('should not log a warning or an error on a successful edit', () => {
        service.editProficiency({ proficiency: createStoredProficiency(), editParams: createEditParams() });

        expect(mockLogger.warning).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return only success and the edited proficiency with every entity field', () => {
        const editParams: Required<ProficiencyEditParams> = {
            name: 'Archery',
            activationWord: 'bow',
            prompt: 'Trained with bows',
            observation: 'Learned as a hunter'
        };

        const response = service.editProficiency({ proficiency: createStoredProficiency(), editParams });

        expect(response).toStrictEqual({
            success: true,
            proficiency: {
                ...editParams,
                id: 'proficiency-1',
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should change only the name when the other fields are resent unchanged', () => {
        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: createEditParams({ name: 'Archery' })
        });

        expect(response.proficiency).toEqual(createStoredProficiency({
            name: 'Archery',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the activationWord when the other fields are resent unchanged', () => {
        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: createEditParams({ activationWord: 'bow' })
        });

        expect(response.proficiency).toEqual(createStoredProficiency({
            activationWord: 'bow',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the prompt when the other fields are resent unchanged', () => {
        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: createEditParams({ prompt: 'Trained with bows' })
        });

        expect(response.proficiency).toEqual(createStoredProficiency({
            prompt: 'Trained with bows',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the observation when the other fields are resent unchanged', () => {
        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: createEditParams({ observation: 'Learned as a hunter' })
        });

        expect(response.proficiency).toEqual(createStoredProficiency({
            observation: 'Learned as a hunter',
            updatedAt: new Date(NOW)
        }));
    });

    it('should keep the id of the proficiency', () => {
        const response = service.editProficiency({
            proficiency: createStoredProficiency({ id: 'proficiency-42' }),
            editParams: createEditParams()
        });

        expect(response.proficiency?.id).toBe('proficiency-42');
    });

    it('should keep the createdAt of the proficiency', () => {
        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: createEditParams()
        });

        expect(response.proficiency?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an id that reaches the service inside editParams', () => {
        const editParamsWithId = { ...createEditParams(), id: 'another-proficiency' };

        const response = service.editProficiency({
            proficiency: createStoredProficiency({ id: 'proficiency-42' }),
            editParams: editParamsWithId
        });

        expect(response.proficiency?.id).toBe('proficiency-42');
    });

    it('should ignore a createdAt that reaches the service inside editParams', () => {
        const editParamsWithCreatedAt = { ...createEditParams(), createdAt: new Date(NOW) };

        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: editParamsWithCreatedAt
        });

        expect(response.proficiency?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an updatedAt that reaches the service inside editParams', () => {
        const editParamsWithUpdatedAt = { ...createEditParams(), updatedAt: new Date(PREVIOUS_UPDATED_AT) };

        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: editParamsWithUpdatedAt
        });

        expect(response.proficiency?.updatedAt).toEqual(new Date(NOW));
    });

    it('should ignore fields that are not editable proficiency fields', () => {
        const editParamsWithUnknownField = { ...createEditParams(), unknownField: 'unexpected' };

        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: editParamsWithUnknownField
        });

        expect(response.proficiency).not.toHaveProperty('unknownField');
    });

    it('should clear the observation when it is sent as undefined', () => {
        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: createEditParams({ observation: undefined })
        });

        expect(response.proficiency?.observation).toBeUndefined();
    });

    it('should clear the observation when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.observation;

        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: editParams
        });

        expect(response.proficiency?.observation).toBeUndefined();
    });

    it('should add the observation to a proficiency that had none', () => {
        const response = service.editProficiency({
            proficiency: createStoredProficiency({ observation: undefined }),
            editParams: createEditParams({ observation: 'Learned as a hunter' })
        });

        expect(response.proficiency?.observation).toEqual('Learned as a hunter');
    });

    it('should store an empty observation as an empty string', () => {
        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: createEditParams({ observation: '' })
        });

        expect(response.proficiency?.observation).toBe('');
    });

    it('should refresh updatedAt even when no field changes', () => {
        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: createEditParams()
        });

        expect(response.proficiency?.updatedAt).toEqual(new Date(NOW));
    });

    it('should return a new object instead of the given proficiency', () => {
        const proficiency = createStoredProficiency();

        const response = service.editProficiency({ proficiency, editParams: createEditParams() });

        expect(response.proficiency).not.toBe(proficiency);
    });

    it('should not mutate the given proficiency', () => {
        const proficiency = createStoredProficiency();

        service.editProficiency({
            proficiency,
            editParams: createEditParams({ name: 'Renamed', observation: undefined })
        });

        expect(proficiency).toStrictEqual(createStoredProficiency());
    });

    it('should not mutate the given editParams', () => {
        const editParams = createEditParams({ name: 'Renamed' });

        service.editProficiency({ proficiency: createStoredProficiency(), editParams });

        expect(editParams).toStrictEqual(createEditParams({ name: 'Renamed' }));
    });

    it('should leave blank fields to the use case validation', () => {
        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: createEditParams({ name: '', activationWord: '', prompt: '' })
        });

        expect(response.success).toBe(true);
        expect(response.proficiency).toEqual(expect.objectContaining({ name: '', activationWord: '', prompt: '' }));
    });

    it('should trim the start and the end of the name', () => {
        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: createEditParams({ name: '  Ação  🔥\n' })
        });

        expect(response.proficiency?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.editProficiency({
            proficiency: createStoredProficiency(),
            editParams: createEditParams({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' })
        });

        expect(response.proficiency).toEqual(expect.objectContaining({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' }));
    });
});
