import { EditCharacterService } from '@application/services/character';
import { Character } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { CharacterEditParams } from '@domain/services';
import { createCharacterHelper } from '@test/helpers';

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

function createStoredCharacter (overrides?: Partial<Character>): Character {
    return createCharacterHelper({
        id: 'character-1',
        name: 'Bram',
        activationWord: 'bram',
        prompt: 'A stoic warrior',
        observation: 'Afraid of heights',
        abilityIds: ['ability-1'],
        proficiencyIds: ['proficiency-1'],
        statusIds: ['status-1'],
        attributes: [{ name: 'Strength', value: 12 }],
        assistantId: 'assistant-1',
        createdAt: new Date(CREATED_AT),
        updatedAt: new Date(PREVIOUS_UPDATED_AT),
        ...overrides
    });
}

function createEditParams (overrides?: Partial<CharacterEditParams>): CharacterEditParams {
    return {
        name: 'Bram',
        activationWord: 'bram',
        prompt: 'A stoic warrior',
        observation: 'Afraid of heights',
        abilityIds: ['ability-1'],
        proficiencyIds: ['proficiency-1'],
        statusIds: ['status-1'],
        attributes: [{ name: 'Strength', value: 12 }],
        assistantId: 'assistant-1',
        ...overrides
    };
}

describe('EditCharacterService', () => {
    let service: EditCharacterService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        service = new EditCharacterService(mockLogger as unknown as ILogger);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.editCharacter({ character: createStoredCharacter(), editParams: createEditParams() });

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditCharacterService::editCharacter');
    });

    it('should not log a warning or an error on a successful edit', () => {
        service.editCharacter({ character: createStoredCharacter(), editParams: createEditParams() });

        expect(mockLogger.warning).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should return only success and the edited character with every entity field', () => {
        const editParams: Required<CharacterEditParams> = {
            name: 'Luna',
            activationWord: 'luna',
            prompt: 'A curious mage',
            observation: 'Afraid of spiders',
            abilityIds: ['ability-2', 'ability-3'],
            proficiencyIds: ['proficiency-2'],
            statusIds: ['status-2'],
            attributes: [{ name: 'Wisdom', value: 15 }],
            assistantId: 'assistant-2'
        };

        const response = service.editCharacter({ character: createStoredCharacter(), editParams });

        expect(response).toStrictEqual({
            success: true,
            character: {
                ...editParams,
                id: 'character-1',
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should change only the name when the other fields are resent unchanged', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ name: 'Luna' })
        });

        expect(response.character).toEqual(createStoredCharacter({
            name: 'Luna',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the activationWord when the other fields are resent unchanged', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ activationWord: 'luna' })
        });

        expect(response.character).toEqual(createStoredCharacter({
            activationWord: 'luna',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the prompt when the other fields are resent unchanged', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ prompt: 'A curious mage' })
        });

        expect(response.character).toEqual(createStoredCharacter({
            prompt: 'A curious mage',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the observation when the other fields are resent unchanged', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ observation: 'Afraid of spiders' })
        });

        expect(response.character).toEqual(createStoredCharacter({
            observation: 'Afraid of spiders',
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the abilityIds when the other fields are resent unchanged', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ abilityIds: ['ability-2', 'ability-3'] })
        });

        expect(response.character).toEqual(createStoredCharacter({
            abilityIds: ['ability-2', 'ability-3'],
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the proficiencyIds when the other fields are resent unchanged', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ proficiencyIds: ['proficiency-2'] })
        });

        expect(response.character).toEqual(createStoredCharacter({
            proficiencyIds: ['proficiency-2'],
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the statusIds when the other fields are resent unchanged', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ statusIds: ['status-2'] })
        });

        expect(response.character).toEqual(createStoredCharacter({
            statusIds: ['status-2'],
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the attributes when the other fields are resent unchanged', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ attributes: [{ name: 'Wisdom', value: 15 }] })
        });

        expect(response.character).toEqual(createStoredCharacter({
            attributes: [{ name: 'Wisdom', value: 15 }],
            updatedAt: new Date(NOW)
        }));
    });

    it('should change only the assistantId when the other fields are resent unchanged', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ assistantId: 'assistant-2' })
        });

        expect(response.character).toEqual(createStoredCharacter({
            assistantId: 'assistant-2',
            updatedAt: new Date(NOW)
        }));
    });

    it('should keep the id of the character', () => {
        const response = service.editCharacter({
            character: createStoredCharacter({ id: 'character-42' }),
            editParams: createEditParams()
        });

        expect(response.character?.id).toBe('character-42');
    });

    it('should keep the createdAt of the character', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams()
        });

        expect(response.character?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an id that reaches the service inside editParams', () => {
        const editParamsWithId = { ...createEditParams(), id: 'another-character' };

        const response = service.editCharacter({
            character: createStoredCharacter({ id: 'character-42' }),
            editParams: editParamsWithId
        });

        expect(response.character?.id).toBe('character-42');
    });

    it('should ignore a createdAt that reaches the service inside editParams', () => {
        const editParamsWithCreatedAt = { ...createEditParams(), createdAt: new Date(NOW) };

        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: editParamsWithCreatedAt
        });

        expect(response.character?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an updatedAt that reaches the service inside editParams', () => {
        const editParamsWithUpdatedAt = { ...createEditParams(), updatedAt: new Date(PREVIOUS_UPDATED_AT) };

        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: editParamsWithUpdatedAt
        });

        expect(response.character?.updatedAt).toEqual(new Date(NOW));
    });

    it('should ignore fields that are not editable character fields', () => {
        const editParamsWithUnknownField = { ...createEditParams(), unknownField: 'unexpected' };

        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: editParamsWithUnknownField
        });

        expect(response.character).not.toHaveProperty('unknownField');
    });

    it('should clear the observation when it is sent as undefined', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ observation: undefined })
        });

        expect(response.character?.observation).toBeUndefined();
    });

    it('should clear the observation when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.observation;

        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: editParams
        });

        expect(response.character?.observation).toBeUndefined();
    });

    it('should add the observation to a character that had none', () => {
        const response = service.editCharacter({
            character: createStoredCharacter({ observation: undefined }),
            editParams: createEditParams({ observation: 'Afraid of spiders' })
        });

        expect(response.character?.observation).toEqual('Afraid of spiders');
    });

    it('should clear the abilityIds when it is sent as undefined', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ abilityIds: undefined })
        });

        expect(response.character?.abilityIds).toBeUndefined();
    });

    it('should clear the abilityIds when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.abilityIds;

        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: editParams
        });

        expect(response.character?.abilityIds).toBeUndefined();
    });

    it('should add the abilityIds to a character that had none', () => {
        const response = service.editCharacter({
            character: createStoredCharacter({ abilityIds: undefined }),
            editParams: createEditParams({ abilityIds: ['ability-2', 'ability-3'] })
        });

        expect(response.character?.abilityIds).toEqual(['ability-2', 'ability-3']);
    });

    it('should clear the proficiencyIds when it is sent as undefined', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ proficiencyIds: undefined })
        });

        expect(response.character?.proficiencyIds).toBeUndefined();
    });

    it('should clear the proficiencyIds when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.proficiencyIds;

        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: editParams
        });

        expect(response.character?.proficiencyIds).toBeUndefined();
    });

    it('should add the proficiencyIds to a character that had none', () => {
        const response = service.editCharacter({
            character: createStoredCharacter({ proficiencyIds: undefined }),
            editParams: createEditParams({ proficiencyIds: ['proficiency-2'] })
        });

        expect(response.character?.proficiencyIds).toEqual(['proficiency-2']);
    });

    it('should clear the statusIds when it is sent as undefined', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ statusIds: undefined })
        });

        expect(response.character?.statusIds).toBeUndefined();
    });

    it('should clear the statusIds when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.statusIds;

        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: editParams
        });

        expect(response.character?.statusIds).toBeUndefined();
    });

    it('should add the statusIds to a character that had none', () => {
        const response = service.editCharacter({
            character: createStoredCharacter({ statusIds: undefined }),
            editParams: createEditParams({ statusIds: ['status-2'] })
        });

        expect(response.character?.statusIds).toEqual(['status-2']);
    });

    it('should clear the attributes when it is sent as undefined', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ attributes: undefined })
        });

        expect(response.character?.attributes).toBeUndefined();
    });

    it('should clear the attributes when the key is omitted', () => {
        const editParams = createEditParams();
        delete editParams.attributes;

        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: editParams
        });

        expect(response.character?.attributes).toBeUndefined();
    });

    it('should add the attributes to a character that had none', () => {
        const response = service.editCharacter({
            character: createStoredCharacter({ attributes: undefined }),
            editParams: createEditParams({ attributes: [{ name: 'Wisdom', value: 15 }] })
        });

        expect(response.character?.attributes).toEqual([{ name: 'Wisdom', value: 15 }]);
    });

    it('should store an empty observation as an empty string', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ observation: '' })
        });

        expect(response.character?.observation).toBe('');
    });

    it('should refresh updatedAt even when no field changes', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams()
        });

        expect(response.character?.updatedAt).toEqual(new Date(NOW));
    });

    it('should keep the stored data when the whole character is sent with a new assistantId', () => {
        const character = createStoredCharacter();

        const response = service.editCharacter({
            character: character,
            editParams: { ...character, assistantId: 'assistant-2' }
        });

        expect(response.character).toEqual(createStoredCharacter({
            assistantId: 'assistant-2',
            updatedAt: new Date(NOW)
        }));
    });

    it('should return a new object instead of the given character', () => {
        const character = createStoredCharacter();

        const response = service.editCharacter({ character, editParams: createEditParams() });

        expect(response.character).not.toBe(character);
    });

    it('should not mutate the given character', () => {
        const character = createStoredCharacter();

        service.editCharacter({
            character,
            editParams: createEditParams({ name: 'Renamed', observation: undefined })
        });

        expect(character).toStrictEqual(createStoredCharacter());
    });

    it('should not mutate the given editParams', () => {
        const editParams = createEditParams({ name: 'Renamed' });

        service.editCharacter({ character: createStoredCharacter(), editParams });

        expect(editParams).toStrictEqual(createEditParams({ name: 'Renamed' }));
    });

    it('should leave blank fields to the use case validation', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ name: '', activationWord: '', prompt: '', assistantId: '' })
        });

        expect(response.success).toBe(true);
        expect(response.character).toEqual(expect.objectContaining({ name: '', activationWord: '', prompt: '', assistantId: '' }));
    });

    it('should trim the start and the end of the name', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ name: '  Ação  🔥\n' })
        });

        expect(response.character?.name).toBe('Ação  🔥');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.editCharacter({
            character: createStoredCharacter(),
            editParams: createEditParams({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' })
        });

        expect(response.character).toEqual(expect.objectContaining({ activationWord: '  Ação 🔥 0\n', prompt: '  Ação 🔥 1\n' }));
    });
});
