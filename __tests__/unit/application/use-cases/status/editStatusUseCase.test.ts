import { EditStatusUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IStatusRepository } from '@domain/repository';
import { StatusEditParams, IEditStatusService } from '@domain/services';
import { createStatusHelper } from '@test/helpers';

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
    getStatusById: jest.fn(),
    getStatuses: jest.fn(),
    editStatus: jest.fn()
};

const mockService = {
    editStatus: jest.fn()
};

const storedStatus = createStatusHelper({ id: 'status-1', name: 'Stored name' });
const editedStatus = createStatusHelper({ id: 'status-1', name: 'Edited name' });

function createEditParams (overrides?: Partial<StatusEditParams>): StatusEditParams {
    return {
        name: 'Edited name',
        activationWord: 'activate',
        prompt: 'A prompt',
        ...overrides
    };
}

function buildUseCase (): EditStatusUseCase {
    return new EditStatusUseCase(
        mockLogger,
        mockService as unknown as IEditStatusService,
        mockRepository as unknown as IStatusRepository
    );
}

describe('EditStatusUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.getStatusById.mockResolvedValue({ success: true, status: storedStatus });
        mockRepository.getStatuses.mockResolvedValue({ success: true, statuses: [storedStatus] });
        mockRepository.editStatus.mockResolvedValue({ success: true });
        mockService.editStatus.mockReturnValue({ success: true, status: editedStatus });
    });

    it('should save the edited status and return its id', async () => {
        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams() });

        expect(mockRepository.editStatus).toHaveBeenCalledWith({ status: editedStatus });
        expect(response).toEqual({ success: true, id: 'status-1' });
    });

    it('should pass the stored status and the editParams to the service', async () => {
        const editParams = createEditParams();

        await buildUseCase().execute({ id: 'status-1', editParams });

        expect(mockService.editStatus).toHaveBeenCalledWith({ status: storedStatus, editParams });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit a status' });
        expect(mockRepository.getStatusById).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit a status' });
        expect(mockRepository.getStatusById).not.toHaveBeenCalled();
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams({ name: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A name is required to edit a status' });
    });

    it('should fail when the activationWord is blank', async () => {
        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams({ activationWord: '   ' }) });

        expect(response).toEqual({ success: false, error: 'An activation word is required to edit a status' });
    });

    it('should fail when the prompt is blank', async () => {
        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams({ prompt: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A prompt is required to edit a status' });
    });

    it('should fail when the status cannot be loaded', async () => {
        mockRepository.getStatusById.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockService.editStatus).not.toHaveBeenCalled();
    });

    it('should fail when the status does not exist', async () => {
        mockRepository.getStatusById.mockResolvedValue({ success: true, status: undefined });

        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Status with id status-1 not found' });
    });

    it('should return the service error', async () => {
        mockService.editStatus.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should return a fallback error when the service fails without one', async () => {
        mockService.editStatus.mockReturnValue({ success: false });

        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on EditStatusService' });
    });

    it('should fail when the service succeeds without a result', async () => {
        mockService.editStatus.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Success is true but does not have a status' });
    });

    it('should fail when the list cannot be loaded', async () => {
        mockRepository.getStatuses.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockRepository.editStatus).not.toHaveBeenCalled();
    });

    it('should fail when the list is missing', async () => {
        mockRepository.getStatuses.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams() });

        expect(response.success).toBe(false);
        expect(mockRepository.editStatus).not.toHaveBeenCalled();
    });

    it('should fail when another entry already has the edited name', async () => {
        mockRepository.getStatuses.mockResolvedValue({
            success: true,
            statuses: [createStatusHelper({ id: 'status-2', name: 'Edited name' })]
        });

        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Status with name Edited name already exists' });
        expect(mockRepository.editStatus).not.toHaveBeenCalled();
    });

    it('should accept the name of the entry being edited', async () => {
        mockRepository.getStatuses.mockResolvedValue({ success: true, statuses: [editedStatus] });

        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should treat names that differ only by case as different names', async () => {
        mockRepository.getStatuses.mockResolvedValue({
            success: true,
            statuses: [createStatusHelper({ id: 'status-2', name: 'edited NAME' })]
        });

        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should return the repository error when saving fails', async () => {
        mockRepository.editStatus.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when saving fails without one', async () => {
        mockRepository.editStatus.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'status-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to edit status' });
    });
});
