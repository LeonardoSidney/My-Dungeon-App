import { CreateCharacterUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import {
    IAbilityRepository,
    IAssistantRepository,
    ICharacterRepository,
    IProficiencyRepository,
    IStatusRepository
} from '@domain/repository';
import { ICreateCharacterService } from '@domain/services';
import { CreateCharacterUseCaseParams } from '@domain/use-cases';
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
    getCharacters: jest.fn(),
    saveCharacter: jest.fn()
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
    createCharacter: jest.fn()
};

const createdCharacter = createCharacterHelper({ id: 'character-1', name: 'Bram' });

function createParams (overrides?: Partial<CreateCharacterUseCaseParams>): CreateCharacterUseCaseParams {
    return {
        name: 'Bram',
        activationWord: 'bram',
        prompt: 'A stoic warrior',
        assistantId: 'assistant-1',
        abilityIds: ['ability-1'],
        proficiencyIds: ['proficiency-1'],
        statusIds: ['status-1'],
        ...overrides
    };
}

function buildUseCase (): CreateCharacterUseCase {
    return new CreateCharacterUseCase(
        mockLogger,
        mockCharacterRepository as unknown as ICharacterRepository,
        mockService as unknown as ICreateCharacterService,
        mockAssistantRepository as unknown as IAssistantRepository,
        mockAbilityRepository as unknown as IAbilityRepository,
        mockProficiencyRepository as unknown as IProficiencyRepository,
        mockStatusRepository as unknown as IStatusRepository
    );
}

describe('CreateCharacterUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAssistantRepository.getAssistantById.mockResolvedValue({ success: true, assistant: createAssistantHelper() });
        mockAbilityRepository.getAbilityById.mockResolvedValue({ success: true, ability: createAbilityHelper() });
        mockProficiencyRepository.getProficiencyById.mockResolvedValue({ success: true, proficiency: createProficiencyHelper() });
        mockStatusRepository.getStatusById.mockResolvedValue({ success: true, status: createStatusHelper() });
        mockCharacterRepository.getCharacters.mockResolvedValue({ success: true, characters: [] });
        mockCharacterRepository.saveCharacter.mockResolvedValue({ success: true });
        mockService.createCharacter.mockReturnValue({ success: true, character: createdCharacter });
    });

    it('should save the created character and return its id', async () => {
        const response = await buildUseCase().execute(createParams());

        expect(mockCharacterRepository.saveCharacter).toHaveBeenCalledWith({ character: createdCharacter });
        expect(response).toEqual({ success: true, id: 'character-1' });
    });

    it('should accept a character without abilities, proficiencies and statuses', async () => {
        const response = await buildUseCase().execute(createParams({
            abilityIds: undefined,
            proficiencyIds: undefined,
            statusIds: undefined
        }));

        expect(response.success).toBe(true);
        expect(mockAbilityRepository.getAbilityById).not.toHaveBeenCalled();
        expect(mockProficiencyRepository.getProficiencyById).not.toHaveBeenCalled();
        expect(mockStatusRepository.getStatusById).not.toHaveBeenCalled();
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute(createParams({ name: '   ' }));

        expect(response).toEqual({ success: false, error: 'Name is required to create a character' });
    });

    it('should fail when the prompt is blank', async () => {
        const response = await buildUseCase().execute(createParams({ prompt: '   ' }));

        expect(response).toEqual({ success: false, error: 'Prompt is required to create a character' });
    });

    it('should fail when the activation word is blank', async () => {
        const response = await buildUseCase().execute(createParams({ activationWord: '   ' }));

        expect(response).toEqual({ success: false, error: 'Activation word is required to create a character' });
    });

    it('should fail when the assistant does not exist', async () => {
        mockAssistantRepository.getAssistantById.mockResolvedValue({ success: true, assistant: undefined });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Entity not found for id: assistant-1 from Assistants' });
        expect(mockService.createCharacter).not.toHaveBeenCalled();
    });

    it('should fail when an ability does not exist', async () => {
        mockAbilityRepository.getAbilityById.mockResolvedValue({ success: true, ability: undefined });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Entity not found for id: ability-1 from Abilities' });
    });

    it('should fail when a proficiency does not exist', async () => {
        mockProficiencyRepository.getProficiencyById.mockResolvedValue({ success: true, proficiency: undefined });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Entity not found for id: proficiency-1 from Proficiencies' });
    });

    it('should fail when a status does not exist', async () => {
        mockStatusRepository.getStatusById.mockResolvedValue({ success: true, status: undefined });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Entity not found for id: status-1 from Statuses' });
    });

    it('should return the service error', async () => {
        mockService.createCharacter.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should fail when the service succeeds without a character', async () => {
        mockService.createCharacter.mockReturnValue({ success: true });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Something went wrong when tried to create the character' });
    });

    it('should fail when the characters cannot be loaded', async () => {
        mockCharacterRepository.getCharacters.mockResolvedValue({ success: false, error: 'Failed to load characters' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Failed to load characters' });
        expect(mockCharacterRepository.saveCharacter).not.toHaveBeenCalled();
    });

    it('should fail when the characters list is missing', async () => {
        mockCharacterRepository.getCharacters.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute(createParams());

        expect(response.success).toBe(false);
        expect(mockCharacterRepository.saveCharacter).not.toHaveBeenCalled();
    });

    it('should fail when a character with the same name already exists', async () => {
        mockCharacterRepository.getCharacters.mockResolvedValue({
            success: true,
            characters: [createCharacterHelper({ id: 'character-2', name: 'Bram' })]
        });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Character with name Bram already exists' });
        expect(mockCharacterRepository.saveCharacter).not.toHaveBeenCalled();
    });

    it('should return the repository error when saving fails', async () => {
        mockCharacterRepository.saveCharacter.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });
});
