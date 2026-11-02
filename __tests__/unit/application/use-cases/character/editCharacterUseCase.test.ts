import { ValidateUniqueIdsService } from '@application/services';
import { EditCharacterUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import {
    IAbilityRepository,
    IAssistantRepository,
    ICharacterRepository,
    IProficiencyRepository,
    IStatusRepository
} from '@domain/repository';
import { CharacterEditParams, IEditCharacterService } from '@domain/services';
import {
    createAbilityHelper,
    createAssistantHelper,
    createCharacterHelper,
    createProficiencyHelper,
    createStatusHelper
} from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockCharacterRepository = {
    getCharacterById: jest.fn(),
    getCharacters: jest.fn(),
    editCharacter: jest.fn()
};

const mockAssistantRepository = {
    getAssistantById: jest.fn()
};

const mockAbilityRepository = {
    getAbilityById: jest.fn()
};

const mockProficiencyRepository = {
    getProficiencyById: jest.fn()
};

const mockStatusRepository = {
    getStatusById: jest.fn()
};

const mockService = {
    editCharacter: jest.fn()
};

const character = createCharacterHelper({ id: 'character-1', name: 'Bram' });
const editedCharacter = createCharacterHelper({ id: 'character-1', name: 'Mira' });

function createEditParams (overrides?: Partial<CharacterEditParams>): CharacterEditParams {
    return {
        name: 'Mira',
        activationWord: 'mira',
        prompt: 'A quiet scout',
        assistantId: 'assistant-1',
        abilityIds: ['ability-1'],
        proficiencyIds: ['proficiency-1'],
        statusIds: ['status-1'],
        ...overrides
    };
}

function buildUseCase (): EditCharacterUseCase {
    return new EditCharacterUseCase(
        mockLogger,
        mockService as unknown as IEditCharacterService,
        new ValidateUniqueIdsService(mockLogger),
        mockCharacterRepository as unknown as ICharacterRepository,
        mockAssistantRepository as unknown as IAssistantRepository,
        mockAbilityRepository as unknown as IAbilityRepository,
        mockProficiencyRepository as unknown as IProficiencyRepository,
        mockStatusRepository as unknown as IStatusRepository
    );
}

describe('EditCharacterUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAssistantRepository.getAssistantById.mockResolvedValue({ success: true, assistant: createAssistantHelper() });
        mockAbilityRepository.getAbilityById.mockResolvedValue({ success: true, ability: createAbilityHelper() });
        mockProficiencyRepository.getProficiencyById.mockResolvedValue({ success: true, proficiency: createProficiencyHelper() });
        mockStatusRepository.getStatusById.mockResolvedValue({ success: true, status: createStatusHelper() });
        mockCharacterRepository.getCharacterById.mockResolvedValue({ success: true, character });
        mockCharacterRepository.getCharacters.mockResolvedValue({ success: true, characters: [character] });
        mockCharacterRepository.editCharacter.mockResolvedValue({ success: true });
        mockService.editCharacter.mockReturnValue({ success: true, character: editedCharacter });
    });

    it('should save the edited character and return its id', async () => {
        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(mockCharacterRepository.editCharacter).toHaveBeenCalledWith({ character: editedCharacter });
        expect(response).toEqual({ success: true, id: 'character-1' });
    });

    it('should pass the stored character and the editParams to the service', async () => {
        const editParams = createEditParams();

        await buildUseCase().execute({ id: 'character-1', editParams });

        expect(mockService.editCharacter).toHaveBeenCalledWith({ character, editParams });
    });

    it('should accept a character without abilities, proficiencies and statuses', async () => {
        const response = await buildUseCase().execute({
            id: 'character-1',
            editParams: createEditParams({ abilityIds: undefined, proficiencyIds: undefined, statusIds: undefined })
        });

        expect(response.success).toBe(true);
        expect(mockAbilityRepository.getAbilityById).not.toHaveBeenCalled();
        expect(mockProficiencyRepository.getProficiencyById).not.toHaveBeenCalled();
        expect(mockStatusRepository.getStatusById).not.toHaveBeenCalled();
    });

    it('should fail when the id is missing', async () => {
        const response = await buildUseCase().execute({ id: '', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit a character' });
        expect(mockCharacterRepository.getCharacterById).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit a character' });
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams({ name: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A name is required to edit a character' });
    });

    it('should fail when the activation word is blank', async () => {
        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams({ activationWord: '   ' }) });

        expect(response).toEqual({ success: false, error: 'An activation word is required to edit a character' });
    });

    it('should fail when the prompt is blank', async () => {
        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams({ prompt: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A prompt is required to edit a character' });
    });

    it('should fail before looking up references when an ability id is repeated', async () => {
        const response = await buildUseCase().execute({
            id: 'character-1',
            editParams: createEditParams({ abilityIds: ['ability-1', 'ability-1'] })
        });

        expect(response).toEqual({ success: false, error: 'Repeated id: ability-1 from Abilities' });
        expect(mockAssistantRepository.getAssistantById).not.toHaveBeenCalled();
    });

    it('should fail before looking up references when a proficiency id is repeated', async () => {
        const response = await buildUseCase().execute({
            id: 'character-1',
            editParams: createEditParams({ proficiencyIds: ['proficiency-1', 'proficiency-1'] })
        });

        expect(response).toEqual({ success: false, error: 'Repeated id: proficiency-1 from Proficiencies' });
        expect(mockAssistantRepository.getAssistantById).not.toHaveBeenCalled();
    });

    it('should fail before looking up references when a status id is repeated', async () => {
        const response = await buildUseCase().execute({
            id: 'character-1',
            editParams: createEditParams({ statusIds: ['status-1', 'status-1'] })
        });

        expect(response).toEqual({ success: false, error: 'Repeated id: status-1 from Statuses' });
        expect(mockAssistantRepository.getAssistantById).not.toHaveBeenCalled();
    });

    it('should fail when the assistant does not exist', async () => {
        mockAssistantRepository.getAssistantById.mockResolvedValue({ success: true, assistant: undefined });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: assistant-1 from Assistants' });
        expect(mockCharacterRepository.getCharacterById).not.toHaveBeenCalled();
    });

    it('should fail when an ability does not exist', async () => {
        mockAbilityRepository.getAbilityById.mockResolvedValue({ success: true, ability: undefined });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: ability-1 from Abilities' });
    });

    it('should fail when a proficiency does not exist', async () => {
        mockProficiencyRepository.getProficiencyById.mockResolvedValue({ success: true, proficiency: undefined });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: proficiency-1 from Proficiencies' });
    });

    it('should fail when a status does not exist', async () => {
        mockStatusRepository.getStatusById.mockResolvedValue({ success: true, status: undefined });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: status-1 from Statuses' });
    });

    it('should fail when the character cannot be loaded', async () => {
        mockCharacterRepository.getCharacterById.mockResolvedValue({ success: false, error: 'Failed to load characters' });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load characters' });
        expect(mockService.editCharacter).not.toHaveBeenCalled();
    });

    it('should fail when the character does not exist', async () => {
        mockCharacterRepository.getCharacterById.mockResolvedValue({ success: true, character: undefined });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Character with id character-1 not found' });
        expect(mockService.editCharacter).not.toHaveBeenCalled();
    });

    it('should return the service error', async () => {
        mockService.editCharacter.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should return a fallback error when the service fails without one', async () => {
        mockService.editCharacter.mockReturnValue({ success: false });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on EditCharacterService' });
    });

    it('should fail when the service succeeds without a character', async () => {
        mockService.editCharacter.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Success is true but does not have a character' });
    });

    it('should fail when the characters cannot be loaded', async () => {
        mockCharacterRepository.getCharacters.mockResolvedValue({ success: false, error: 'Failed to load characters' });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load characters' });
        expect(mockCharacterRepository.editCharacter).not.toHaveBeenCalled();
    });

    it('should fail when the characters list is missing', async () => {
        mockCharacterRepository.getCharacters.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response.success).toBe(false);
        expect(mockCharacterRepository.editCharacter).not.toHaveBeenCalled();
    });

    it('should fail when another character already has the edited name', async () => {
        mockCharacterRepository.getCharacters.mockResolvedValue({
            success: true,
            characters: [createCharacterHelper({ id: 'character-2', name: 'Mira' })]
        });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Character with name Mira already exists' });
        expect(mockCharacterRepository.editCharacter).not.toHaveBeenCalled();
    });

    it('should accept the name of the character being edited', async () => {
        mockCharacterRepository.getCharacters.mockResolvedValue({ success: true, characters: [editedCharacter] });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should return the repository error when saving fails', async () => {
        mockCharacterRepository.editCharacter.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when saving fails without one', async () => {
        mockCharacterRepository.editCharacter.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'character-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to edit character' });
    });
});
