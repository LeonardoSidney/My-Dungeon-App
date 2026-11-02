import { CreateAbilityUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IAbilityRepository } from '@domain/repository';
import { CreateAbilityServiceParams, ICreateAbilityService } from '@domain/services';
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
    getAbilities: jest.fn(),
    saveAbility: jest.fn()
};

const mockService = {
    createAbility: jest.fn()
};

const createdAbility = createAbilityHelper({ id: 'ability-1', name: 'Fireball' });

function createParams (overrides?: Partial<CreateAbilityServiceParams>): CreateAbilityServiceParams {
    return {
        name: 'Fireball',
        activationWord: 'fire',
        prompt: 'Deal fire damage to target',
        ...overrides
    };
}

function buildUseCase (): CreateAbilityUseCase {
    return new CreateAbilityUseCase(
        mockLogger,
        mockService as unknown as ICreateAbilityService,
        mockAbilityRepository as unknown as IAbilityRepository
    );
}

describe('CreateAbilityUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAbilityRepository.getAbilities.mockResolvedValue({ success: true, abilities: [] });
        mockAbilityRepository.saveAbility.mockResolvedValue({ success: true });
        mockService.createAbility.mockReturnValue({ success: true, ability: createdAbility });
    });

    it('should save the created ability and return its id', async () => {
        const response = await buildUseCase().execute(createParams());

        expect(mockAbilityRepository.saveAbility).toHaveBeenCalledWith({ ability: createdAbility });
        expect(response).toEqual({ success: true, id: 'ability-1' });
    });

    it('should pass the params to the service', async () => {
        const params = createParams({ observation: 'Needs a clear line of sight' });

        await buildUseCase().execute(params);

        expect(mockService.createAbility).toHaveBeenCalledWith(params);
    });

    it('should fail when the name is missing', async () => {
        const response = await buildUseCase().execute(createParams({ name: '' }));

        expect(response).toEqual({ success: false, error: 'name is required to create an ability' });
        expect(mockService.createAbility).not.toHaveBeenCalled();
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute(createParams({ name: ' \t\n ' }));

        expect(response).toEqual({ success: false, error: 'name is required to create an ability' });
        expect(mockService.createAbility).not.toHaveBeenCalled();
    });

    it('should fail when the activation word is blank', async () => {
        const response = await buildUseCase().execute(createParams({ activationWord: '   ' }));

        expect(response).toEqual({ success: false, error: 'activationWord is required to create an ability' });
        expect(mockService.createAbility).not.toHaveBeenCalled();
    });

    it('should fail when the prompt is blank', async () => {
        const response = await buildUseCase().execute(createParams({ prompt: '   ' }));

        expect(response).toEqual({ success: false, error: 'prompt is required to create an ability' });
        expect(mockService.createAbility).not.toHaveBeenCalled();
    });

    it('should accept a missing observation', async () => {
        const response = await buildUseCase().execute(createParams({ observation: undefined }));

        expect(response.success).toBe(true);
    });

    it('should return the service error', async () => {
        mockService.createAbility.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Service failed' });
        expect(mockAbilityRepository.saveAbility).not.toHaveBeenCalled();
    });

    it('should return a fallback error when the service fails without one', async () => {
        mockService.createAbility.mockReturnValue({ success: false });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on CreateAbilityService' });
        expect(mockAbilityRepository.saveAbility).not.toHaveBeenCalled();
    });

    it('should fail when the service succeeds without an ability', async () => {
        mockService.createAbility.mockReturnValue({ success: true });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Unexpected error while creating ability' });
        expect(mockAbilityRepository.saveAbility).not.toHaveBeenCalled();
    });

    it('should fail when the abilities cannot be loaded', async () => {
        mockAbilityRepository.getAbilities.mockResolvedValue({ success: false, error: 'Storage offline' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Storage offline' });
        expect(mockAbilityRepository.saveAbility).not.toHaveBeenCalled();
    });

    it('should return a fallback error when the abilities list is missing', async () => {
        mockAbilityRepository.getAbilities.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Failed to load abilities' });
        expect(mockAbilityRepository.saveAbility).not.toHaveBeenCalled();
    });

    it('should fail when another ability already has the name', async () => {
        mockAbilityRepository.getAbilities.mockResolvedValue({
            success: true,
            abilities: [createAbilityHelper({ id: 'ability-2', name: 'Fireball' })]
        });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Ability already exists' });
        expect(mockAbilityRepository.saveAbility).not.toHaveBeenCalled();
    });

    it('should compare the name built by the service against the existing abilities', async () => {
        mockService.createAbility.mockReturnValue({ success: true, ability: createAbilityHelper({ name: 'Fireball' }) });
        mockAbilityRepository.getAbilities.mockResolvedValue({
            success: true,
            abilities: [createAbilityHelper({ id: 'ability-2', name: 'Fireball' })]
        });

        const response = await buildUseCase().execute(createParams({ name: '  Fireball  ' }));

        expect(response).toEqual({ success: false, error: 'Ability already exists' });
    });

    it('should treat names that differ only by case as different names', async () => {
        mockAbilityRepository.getAbilities.mockResolvedValue({
            success: true,
            abilities: [createAbilityHelper({ id: 'ability-2', name: 'fireball' })]
        });

        const response = await buildUseCase().execute(createParams());

        expect(response.success).toBe(true);
    });

    it('should return the repository error when saving fails', async () => {
        mockAbilityRepository.saveAbility.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when saving fails without one', async () => {
        mockAbilityRepository.saveAbility.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Failed to save ability' });
    });
});
