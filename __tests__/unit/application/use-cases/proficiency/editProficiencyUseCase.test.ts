import { EditProficiencyUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IProficiencyRepository } from '@domain/repository';
import { ProficiencyEditParams, IEditProficiencyService } from '@domain/services';
import { createProficiencyHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockRepository = {
    getProficiencyById: jest.fn(),
    getProficiencies: jest.fn(),
    editProficiency: jest.fn()
};

const mockService = {
    editProficiency: jest.fn()
};

const storedProficiency = createProficiencyHelper({ id: 'proficiency-1', name: 'Stored name' });
const editedProficiency = createProficiencyHelper({ id: 'proficiency-1', name: 'Edited name' });

function createEditParams (overrides?: Partial<ProficiencyEditParams>): ProficiencyEditParams {
    return {
        name: 'Edited name',
        activationWord: 'activate',
        prompt: 'A prompt',
        ...overrides
    };
}

function buildUseCase (): EditProficiencyUseCase {
    return new EditProficiencyUseCase(
        mockLogger,
        mockService as unknown as IEditProficiencyService,
        mockRepository as unknown as IProficiencyRepository
    );
}

describe('EditProficiencyUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.getProficiencyById.mockResolvedValue({ success: true, proficiency: storedProficiency });
        mockRepository.getProficiencies.mockResolvedValue({ success: true, proficiencies: [storedProficiency] });
        mockRepository.editProficiency.mockResolvedValue({ success: true });
        mockService.editProficiency.mockReturnValue({ success: true, proficiency: editedProficiency });
    });

    it('should save the edited proficiency and return its id', async () => {
        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams() });

        expect(mockRepository.editProficiency).toHaveBeenCalledWith({ proficiency: editedProficiency });
        expect(response).toEqual({ success: true, id: 'proficiency-1' });
    });

    it('should pass the stored proficiency and the editParams to the service', async () => {
        const editParams = createEditParams();

        await buildUseCase().execute({ id: 'proficiency-1', editParams });

        expect(mockService.editProficiency).toHaveBeenCalledWith({ proficiency: storedProficiency, editParams });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit a proficiency' });
        expect(mockRepository.getProficiencyById).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit a proficiency' });
        expect(mockRepository.getProficiencyById).not.toHaveBeenCalled();
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams({ name: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A name is required to edit a proficiency' });
    });

    it('should fail when the activationWord is blank', async () => {
        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams({ activationWord: '   ' }) });

        expect(response).toEqual({ success: false, error: 'An activation word is required to edit a proficiency' });
    });

    it('should fail when the prompt is blank', async () => {
        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams({ prompt: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A prompt is required to edit a proficiency' });
    });

    it('should fail when the proficiency cannot be loaded', async () => {
        mockRepository.getProficiencyById.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockService.editProficiency).not.toHaveBeenCalled();
    });

    it('should fail when the proficiency does not exist', async () => {
        mockRepository.getProficiencyById.mockResolvedValue({ success: true, proficiency: undefined });

        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Proficiency with id proficiency-1 not found' });
    });

    it('should return the service error', async () => {
        mockService.editProficiency.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should return a fallback error when the service fails without one', async () => {
        mockService.editProficiency.mockReturnValue({ success: false });

        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on EditProficiencyService' });
    });

    it('should fail when the service succeeds without a result', async () => {
        mockService.editProficiency.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Success is true but does not have a proficiency' });
    });

    it('should fail when the list cannot be loaded', async () => {
        mockRepository.getProficiencies.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockRepository.editProficiency).not.toHaveBeenCalled();
    });

    it('should fail when the list is missing', async () => {
        mockRepository.getProficiencies.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams() });

        expect(response.success).toBe(false);
        expect(mockRepository.editProficiency).not.toHaveBeenCalled();
    });

    it('should fail when another entry already has the edited name', async () => {
        mockRepository.getProficiencies.mockResolvedValue({
            success: true,
            proficiencies: [createProficiencyHelper({ id: 'proficiency-2', name: 'Edited name' })]
        });

        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Proficiency with name Edited name already exists' });
        expect(mockRepository.editProficiency).not.toHaveBeenCalled();
    });

    it('should accept the name of the entry being edited', async () => {
        mockRepository.getProficiencies.mockResolvedValue({ success: true, proficiencies: [editedProficiency] });

        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should treat names that differ only by case as different names', async () => {
        mockRepository.getProficiencies.mockResolvedValue({
            success: true,
            proficiencies: [createProficiencyHelper({ id: 'proficiency-2', name: 'edited NAME' })]
        });

        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should return the repository error when saving fails', async () => {
        mockRepository.editProficiency.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when saving fails without one', async () => {
        mockRepository.editProficiency.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'proficiency-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to edit proficiency' });
    });
});
