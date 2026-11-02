import { EditWorldMasterUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IAssistantRepository, IWorldMasterRepository } from '@domain/repository';
import { WorldMasterEditParams, IEditWorldMasterService } from '@domain/services';
import { createAssistantHelper, createWorldMasterHelper } from '@test/helpers';

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
    getWorldMasterById: jest.fn(),
    getWorldMasters: jest.fn(),
    editWorldMaster: jest.fn()
};

const mockService = {
    editWorldMaster: jest.fn()
};

const mockAssistantRepository = {
    getAssistantById: jest.fn()
};

const storedWorldMaster = createWorldMasterHelper({ id: 'worldMaster-1', name: 'Stored name' });
const editedWorldMaster = createWorldMasterHelper({ id: 'worldMaster-1', name: 'Edited name' });

function createEditParams (overrides?: Partial<WorldMasterEditParams>): WorldMasterEditParams {
    return {
        name: 'Edited name',
        activationWord: 'activate',
        prompt: 'A prompt',
        assistantId: 'assistant-2',
        ...overrides
    };
}

function buildUseCase (): EditWorldMasterUseCase {
    return new EditWorldMasterUseCase(
        mockLogger,
        mockService as unknown as IEditWorldMasterService,
        mockRepository as unknown as IWorldMasterRepository,
        mockAssistantRepository as unknown as IAssistantRepository
    );
}

describe('EditWorldMasterUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAssistantRepository.getAssistantById.mockResolvedValue({ success: true, assistant: createAssistantHelper() });
        mockRepository.getWorldMasterById.mockResolvedValue({ success: true, worldMaster: storedWorldMaster });
        mockRepository.getWorldMasters.mockResolvedValue({ success: true, worldMasters: [storedWorldMaster] });
        mockRepository.editWorldMaster.mockResolvedValue({ success: true });
        mockService.editWorldMaster.mockReturnValue({ success: true, worldMaster: editedWorldMaster });
    });

    it('should save the edited worldMaster and return its id', async () => {
        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(mockRepository.editWorldMaster).toHaveBeenCalledWith({ worldMaster: editedWorldMaster });
        expect(response).toEqual({ success: true, id: 'worldMaster-1' });
    });

    it('should pass the stored worldMaster and the editParams to the service', async () => {
        const editParams = createEditParams();

        await buildUseCase().execute({ id: 'worldMaster-1', editParams });

        expect(mockService.editWorldMaster).toHaveBeenCalledWith({ worldMaster: storedWorldMaster, editParams });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit a world master' });
        expect(mockRepository.getWorldMasterById).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit a world master' });
        expect(mockRepository.getWorldMasterById).not.toHaveBeenCalled();
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams({ name: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A name is required to edit a world master' });
    });

    it('should fail when the activationWord is blank', async () => {
        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams({ activationWord: '   ' }) });

        expect(response).toEqual({ success: false, error: 'An activation word is required to edit a world master' });
    });

    it('should fail when the prompt is blank', async () => {
        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams({ prompt: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A prompt is required to edit a world master' });
    });

    it('should fail when the assistant does not exist', async () => {
        mockAssistantRepository.getAssistantById.mockResolvedValue({ success: true, assistant: undefined });

        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: assistant-2 from Assistants' });
        expect(mockService.editWorldMaster).not.toHaveBeenCalled();
    });

    it('should fail when the worldMaster cannot be loaded', async () => {
        mockRepository.getWorldMasterById.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockService.editWorldMaster).not.toHaveBeenCalled();
    });

    it('should fail when the worldMaster does not exist', async () => {
        mockRepository.getWorldMasterById.mockResolvedValue({ success: true, worldMaster: undefined });

        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'World master with id worldMaster-1 not found' });
    });

    it('should return the service error', async () => {
        mockService.editWorldMaster.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should return a fallback error when the service fails without one', async () => {
        mockService.editWorldMaster.mockReturnValue({ success: false });

        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on EditWorldMasterService' });
    });

    it('should fail when the service succeeds without a result', async () => {
        mockService.editWorldMaster.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Success is true but does not have a worldMaster' });
    });

    it('should fail when the list cannot be loaded', async () => {
        mockRepository.getWorldMasters.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockRepository.editWorldMaster).not.toHaveBeenCalled();
    });

    it('should fail when the list is missing', async () => {
        mockRepository.getWorldMasters.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(response.success).toBe(false);
        expect(mockRepository.editWorldMaster).not.toHaveBeenCalled();
    });

    it('should fail when another entry already has the edited name', async () => {
        mockRepository.getWorldMasters.mockResolvedValue({
            success: true,
            worldMasters: [createWorldMasterHelper({ id: 'worldMaster-2', name: 'Edited name' })]
        });

        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'World master with name Edited name already exists' });
        expect(mockRepository.editWorldMaster).not.toHaveBeenCalled();
    });

    it('should accept the name of the entry being edited', async () => {
        mockRepository.getWorldMasters.mockResolvedValue({ success: true, worldMasters: [editedWorldMaster] });

        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should treat names that differ only by case as different names', async () => {
        mockRepository.getWorldMasters.mockResolvedValue({
            success: true,
            worldMasters: [createWorldMasterHelper({ id: 'worldMaster-2', name: 'edited NAME' })]
        });

        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should return the repository error when saving fails', async () => {
        mockRepository.editWorldMaster.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when saving fails without one', async () => {
        mockRepository.editWorldMaster.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'worldMaster-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to edit world master' });
    });
});
