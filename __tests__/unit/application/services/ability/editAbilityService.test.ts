import { EditAbilityService } from '@application/services/ability';
import { Ability } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { AbilityEditParams } from '@domain/services';
import { createAbilityHelper } from '@test/helpers';

const CREATED_AT = '2026-01-10T08:00:00.000Z';
const PREVIOUS_UPDATED_AT = '2026-02-20T09:30:00.000Z';
const NOW = '2026-06-15T12:00:00.000Z';
const LATER = '2026-06-15T12:05:00.000Z';

const mockLogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

function createStoredAbility (overrides?: Partial<Ability>): Ability {
    return createAbilityHelper({
        id: 'ability-1',
        name: 'Fireball',
        activationWord: 'fire',
        prompt: 'Deal fire damage to target',
        observation: 'Needs a clear line of sight',
        createdAt: new Date(CREATED_AT),
        updatedAt: new Date(PREVIOUS_UPDATED_AT),
        ...overrides
    });
}

function createEditParams (overrides?: Partial<AbilityEditParams>): AbilityEditParams {
    return {
        name: 'Fireball',
        activationWord: 'fire',
        prompt: 'Deal fire damage to target',
        observation: 'Needs a clear line of sight',
        ...overrides
    };
}

describe('EditAbilityService', () => {
    let service: EditAbilityService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        service = new EditAbilityService(mockLogger as unknown as ILogger);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.editAbility({ ability: createStoredAbility(), editParams: createEditParams() });

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditAbilityService::editAbility');
    });

    it('should not log a warning or an error on a successful edit', () => {
        service.editAbility({ ability: createStoredAbility(), editParams: createEditParams() });

        expect(mockLogger.warning).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return only success and the edited ability with every entity field', () => {
        const editParams: Required<AbilityEditParams> = {
            name: 'Ice Storm',
            activationWord: 'ice',
            prompt: 'Freeze enemies in area',
            observation: 'Slows the targets'
        };

        const response = service.editAbility({ ability: createStoredAbility(), editParams });

        expect(response).toStrictEqual({
            success: true,
            ability: {
                ...editParams,
                id: 'ability-1',
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should change only the name when the other fields are resent unchanged', () => {
        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams({ name: 'Greater Fireball' })
        });

        expect(response.ability).toEqual(createStoredAbility({
            name: 'Greater Fireball',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the activationWord when the other fields are resent unchanged', () => {
        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams({ activationWord: 'flame' })
        });

        expect(response.ability).toEqual(createStoredAbility({
            activationWord: 'flame',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the prompt when the other fields are resent unchanged', () => {
        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams({ prompt: 'Deal massive fire damage' })
        });

        expect(response.ability).toEqual(createStoredAbility({
            prompt: 'Deal massive fire damage',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the observation when the other fields are resent unchanged', () => {
        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams({ observation: 'Works underwater' })
        });

        expect(response.ability).toEqual(createStoredAbility({
            observation: 'Works underwater',
            updatedAt: new Date(NOW)
        }));
    });

    it('should keep the id of the ability', () => {
        const response = service.editAbility({
            ability: createStoredAbility({ id: 'ability-42' }),
            editParams: createEditParams({ name: 'Renamed' })
        });

        expect(response.ability?.id).toBe('ability-42');
    });

    it('should keep the createdAt of the ability', () => {
        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams({ name: 'Renamed' })
        });

        expect(response.ability?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an id that reaches the service inside editParams', () => {
        const editParamsWithId = { ...createEditParams(), id: 'another-ability' };

        const response = service.editAbility({
            ability: createStoredAbility({ id: 'ability-42' }),
            editParams: editParamsWithId
        });

        expect(response.ability?.id).toBe('ability-42');
    });

    it('should ignore a createdAt that reaches the service inside editParams', () => {
        const editParamsWithCreatedAt = { ...createEditParams(), createdAt: new Date(LATER) };

        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: editParamsWithCreatedAt
        });

        expect(response.ability?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore fields that are not editable ability fields', () => {
        const editParamsWithUnknownField = { ...createEditParams(), unknownField: 'unexpected' };

        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: editParamsWithUnknownField
        });

        expect(response.ability).not.toHaveProperty('unknownField');
    });

    it('should clear the observation when it is sent as undefined', () => {
        const response = service.editAbility({
            ability: createStoredAbility({ observation: 'Old observation' }),
            editParams: createEditParams({ observation: undefined })
        });

        expect(response.ability).toStrictEqual(createStoredAbility({
            observation: undefined,
            updatedAt: new Date(NOW)
        }));
    });

    it('should clear the observation when the key is omitted', () => {
        const response = service.editAbility({
            ability: createStoredAbility({ observation: 'Old observation' }),
            editParams: {
                name: 'Fireball',
                activationWord: 'fire',
                prompt: 'Deal fire damage to target'
            }
        });

        expect(response.ability).toStrictEqual(createStoredAbility({
            observation: undefined,
            updatedAt: new Date(NOW)
        }));
    });

    it('should store an empty observation as an empty string', () => {
        const response = service.editAbility({
            ability: createStoredAbility({ observation: 'Old observation' }),
            editParams: createEditParams({ observation: '' })
        });

        expect(response.ability?.observation).toBe('');
    });

    it('should add an observation to an ability that had none', () => {
        const response = service.editAbility({
            ability: createStoredAbility({ observation: undefined }),
            editParams: createEditParams({ observation: 'New observation' })
        });

        expect(response.ability?.observation).toBe('New observation');
    });

    it('should keep an ability without observation when none is sent', () => {
        const response = service.editAbility({
            ability: createStoredAbility({ observation: undefined }),
            editParams: createEditParams({ observation: undefined })
        });

        expect(response.ability).toStrictEqual(createStoredAbility({
            observation: undefined,
            updatedAt: new Date(NOW)
        }));
    });

    it('should set updatedAt to the current time', () => {
        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams({ name: 'Renamed' })
        });

        expect(response.ability?.updatedAt).toEqual(new Date(NOW));
    });

    it('should refresh updatedAt even when no field changes', () => {
        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams()
        });

        expect(response.ability?.updatedAt).toEqual(new Date(NOW));
    });

    it('should replace an updatedAt that is ahead of the current time', () => {
        const response = service.editAbility({
            ability: createStoredAbility({ updatedAt: new Date('2030-01-01T00:00:00.000Z') }),
            editParams: createEditParams()
        });

        expect(response.ability?.updatedAt).toEqual(new Date(NOW));
    });

    it('should ignore an updatedAt that reaches the service inside editParams', () => {
        const editParamsWithUpdatedAt = { ...createEditParams(), updatedAt: new Date(PREVIOUS_UPDATED_AT) };

        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: editParamsWithUpdatedAt
        });

        expect(response.ability?.updatedAt).toEqual(new Date(NOW));
    });

    it('should refresh updatedAt and keep id and createdAt across consecutive edits', () => {
        const firstResponse = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams({ name: 'First edit' })
        });
        jest.setSystemTime(new Date(LATER));

        const secondResponse = service.editAbility({
            ability: firstResponse.ability as Ability,
            editParams: createEditParams({ name: 'Second edit' })
        });

        expect(firstResponse.ability?.updatedAt).toEqual(new Date(NOW));
        expect(secondResponse.ability).toEqual(createStoredAbility({
            name: 'Second edit',
            updatedAt: new Date(LATER)
        }));
    });

    it('should return a new object instead of the given ability', () => {
        const ability = createStoredAbility();

        const response = service.editAbility({ ability, editParams: createEditParams() });

        expect(response.ability).not.toBe(ability);
    });

    it('should not mutate the given ability', () => {
        const ability = createStoredAbility();

        service.editAbility({
            ability,
            editParams: createEditParams({ name: 'Renamed', observation: undefined })
        });

        expect(ability).toStrictEqual(createStoredAbility());
    });

    it('should not mutate the given editParams', () => {
        const editParams = createEditParams({ name: 'Renamed' });

        service.editAbility({ ability: createStoredAbility(), editParams });

        expect(editParams).toStrictEqual(createEditParams({ name: 'Renamed' }));
    });

    it('should leave blank fields to the use case validation', () => {
        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams({ name: '', activationWord: '', prompt: '' })
        });

        expect(response.success).toBe(true);
        expect(response.ability).toEqual(expect.objectContaining({ name: '', activationWord: '', prompt: '' }));
    });

    it('should trim the start and the end of the name', () => {
        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams({ name: '  Fire  ball\n' })
        });

        expect(response.ability?.name).toBe('Fire  ball');
    });

    it('should reduce a name made only of whitespace to an empty string', () => {
        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams({ name: ' \t\n ' })
        });

        expect(response.ability?.name).toBe('');
    });

    it('should store the other text fields without trimming them', () => {
        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams({ activationWord: ' fire ', prompt: '\tBurn\n' })
        });

        expect(response.ability).toEqual(expect.objectContaining({
            activationWord: ' fire ',
            prompt: '\tBurn\n'
        }));
    });

    it('should store the text fields with the casing as sent', () => {
        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams({ name: 'FIREball', activationWord: 'FiRe', prompt: 'BURN them' })
        });

        expect(response.ability).toEqual(expect.objectContaining({
            name: 'FIREball',
            activationWord: 'FiRe',
            prompt: 'BURN them'
        }));
    });

    it('should store multiline and non-ascii text exactly as sent', () => {
        const prompt = 'Linha 1: ação\nLinha 2: 火の玉 🔥\n{{char}} usa "Bola de Fogo"';

        const response = service.editAbility({
            ability: createStoredAbility(),
            editParams: createEditParams({ prompt })
        });

        expect(response.ability?.prompt).toBe(prompt);
    });

    it('should not carry data from one edit to the next on the same instance', () => {
        service.editAbility({
            ability: createStoredAbility({ id: 'ability-1', observation: 'From the first ability' }),
            editParams: createEditParams({ name: 'First ability' })
        });

        const response = service.editAbility({
            ability: {
                id: 'ability-2',
                name: 'Second ability',
                activationWord: 'second',
                prompt: 'Second prompt',
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(PREVIOUS_UPDATED_AT)
            },
            editParams: {
                name: 'Second ability',
                activationWord: 'second',
                prompt: 'Second prompt'
            }
        });

        expect(response.ability).toStrictEqual({
            id: 'ability-2',
            name: 'Second ability',
            activationWord: 'second',
            prompt: 'Second prompt',
            observation: undefined,
            createdAt: new Date(CREATED_AT),
            updatedAt: new Date(NOW)
        });
    });
});
