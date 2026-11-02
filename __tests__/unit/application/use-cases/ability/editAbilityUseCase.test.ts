import { EditAbilityUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IAbilityRepository } from '@domain/repository';
import { AbilityEditParams, IEditAbilityService } from '@domain/services';
import { createAbilityHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockAbilityRepository = {
    getAbilityById: jest.fn(),
    getAbilities: jest.fn(),
    editAbility: jest.fn()
};

const mockService = {
    editAbility: jest.fn()
};

const ability = createAbilityHelper({ id: 'ability-1', name: 'Fireball' });
const editedAbility = createAbilityHelper({ id: 'ability-1', name: 'Ice Storm' });

function createEditParams (overrides?: Partial<AbilityEditParams>): AbilityEditParams {
    return {
        name: 'Ice Storm',
        activationWord: 'ice',
        prompt: 'Freeze enemies in area',
        ...overrides
    };
}

function buildUseCase (): EditAbilityUseCase {
    return new EditAbilityUseCase(
        mockLogger,
        mockService as unknown as IEditAbilityService,
        mockAbilityRepository as unknown as IAbilityRepository
    );
}

describe('EditAbilityUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAbilityRepository.getAbilityById.mockResolvedValue({ success: true, ability });
        mockAbilityRepository.getAbilities.mockResolvedValue({ success: true, abilities: [ability] });
        mockAbilityRepository.editAbility.mockResolvedValue({ success: true });
        mockService.editAbility.mockReturnValue({ success: true, ability: editedAbility });
    });

    it('should save the edited ability and return its id', async () => {
        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams() });

        expect(mockAbilityRepository.editAbility).toHaveBeenCalledWith({ ability: editedAbility });
        expect(response).toEqual({ success: true, id: 'ability-1' });
    });

    it('should pass the stored ability and the editParams to the service', async () => {
        const editParams = createEditParams();

        await buildUseCase().execute({ id: 'ability-1', editParams });

        expect(mockService.editAbility).toHaveBeenCalledWith({ ability, editParams });
    });

    it('should fail when the id is missing', async () => {
        const response = await buildUseCase().execute({ id: '', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit an ability' });
        expect(mockAbilityRepository.getAbilityById).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit an ability' });
        expect(mockAbilityRepository.getAbilityById).not.toHaveBeenCalled();
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams({ name: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A name is required to edit an ability' });
    });

    it('should fail when the activation word is blank', async () => {
        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams({ activationWord: '   ' }) });

        expect(response).toEqual({ success: false, error: 'An activation word is required to edit an ability' });
    });

    it('should fail when the prompt is blank', async () => {
        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams({ prompt: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A prompt is required to edit an ability' });
    });

    it('should fail when the ability cannot be loaded', async () => {
        mockAbilityRepository.getAbilityById.mockResolvedValue({ success: false, error: 'Failed to load abilities' });

        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load abilities' });
        expect(mockService.editAbility).not.toHaveBeenCalled();
    });

    it('should fail when the ability does not exist', async () => {
        mockAbilityRepository.getAbilityById.mockResolvedValue({ success: true, ability: undefined });

        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Ability with id ability-1 not found' });
    });

    it('should return the service error', async () => {
        mockService.editAbility.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should return a fallback error when the service fails without one', async () => {
        mockService.editAbility.mockReturnValue({ success: false });

        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on EditAbilityService' });
    });

    it('should fail when the service succeeds without an ability', async () => {
        mockService.editAbility.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Success is true but does not have an ability' });
    });

    it('should fail when the abilities cannot be loaded', async () => {
        mockAbilityRepository.getAbilities.mockResolvedValue({ success: false, error: 'Failed to load abilities' });

        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load abilities' });
        expect(mockAbilityRepository.editAbility).not.toHaveBeenCalled();
    });

    it('should fail when the abilities list is missing', async () => {
        mockAbilityRepository.getAbilities.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams() });

        expect(response.success).toBe(false);
        expect(mockAbilityRepository.editAbility).not.toHaveBeenCalled();
    });

    it('should fail when another ability already has the edited name', async () => {
        mockAbilityRepository.getAbilities.mockResolvedValue({
            success: true,
            abilities: [createAbilityHelper({ id: 'ability-2', name: 'Ice Storm' })]
        });

        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Ability with name Ice Storm already exists' });
        expect(mockAbilityRepository.editAbility).not.toHaveBeenCalled();
    });

    it('should accept the name of the ability being edited', async () => {
        mockAbilityRepository.getAbilities.mockResolvedValue({ success: true, abilities: [editedAbility] });

        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should treat names that differ only by case as different names', async () => {
        mockAbilityRepository.getAbilities.mockResolvedValue({
            success: true,
            abilities: [createAbilityHelper({ id: 'ability-2', name: 'ice storm' })]
        });

        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should return the repository error when saving fails', async () => {
        mockAbilityRepository.editAbility.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when saving fails without one', async () => {
        mockAbilityRepository.editAbility.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'ability-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to edit ability' });
    });
});
