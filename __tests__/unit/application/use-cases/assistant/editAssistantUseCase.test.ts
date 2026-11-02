import { EditAssistantUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IAssistantRepository, IConnectionRepository, ISamplerRepository } from '@domain/repository';
import { AssistantEditParams, IEditAssistantService, IGetSamplersService } from '@domain/services';
import { createAssistantHelper, createConnectionHelper, createSamplerHelper } from '@test/helpers';

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
    getAssistantById: jest.fn(),
    getAssistants: jest.fn(),
    editAssistant: jest.fn()
};

const mockService = {
    editAssistant: jest.fn()
};

const mockSamplerRepository = {
    getSamplerById: jest.fn()
};

const mockConnectionRepository = {
    getConnectionById: jest.fn()
};

const mockGetSamplersService = {
    findSystemDefaultSampler: jest.fn()
};

const storedAssistant = createAssistantHelper({ id: 'assistant-1', name: 'Stored name' });
const editedAssistant = createAssistantHelper({ id: 'assistant-1', name: 'Edited name' });

function createEditParams (overrides?: Partial<AssistantEditParams>): AssistantEditParams {
    return {
        name: 'Edited name',
        modelId: 'model-1',
        samplerId: 'sampler-2',
        connectionId: 'connection-2',
        ...overrides
    };
}

function buildUseCase (): EditAssistantUseCase {
    return new EditAssistantUseCase(
        mockLogger,
        mockService as unknown as IEditAssistantService,
        mockRepository as unknown as IAssistantRepository,
        mockSamplerRepository as unknown as ISamplerRepository,
        mockGetSamplersService as unknown as IGetSamplersService,
        mockConnectionRepository as unknown as IConnectionRepository
    );
}

describe('EditAssistantUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSamplerRepository.getSamplerById.mockResolvedValue({ success: true, sampler: createSamplerHelper() });
        mockGetSamplersService.findSystemDefaultSampler.mockReturnValue(undefined);
        mockConnectionRepository.getConnectionById.mockResolvedValue({ success: true, connection: createConnectionHelper() });
        mockRepository.getAssistantById.mockResolvedValue({ success: true, assistant: storedAssistant });
        mockRepository.getAssistants.mockResolvedValue({ success: true, assistants: [storedAssistant] });
        mockRepository.editAssistant.mockResolvedValue({ success: true });
        mockService.editAssistant.mockReturnValue({ success: true, assistant: editedAssistant });
    });

    it('should save the edited assistant and return its id', async () => {
        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(mockRepository.editAssistant).toHaveBeenCalledWith({ assistant: editedAssistant });
        expect(response).toEqual({ success: true, id: 'assistant-1' });
    });

    it('should pass the stored assistant and the editParams to the service', async () => {
        const editParams = createEditParams();

        await buildUseCase().execute({ id: 'assistant-1', editParams });

        expect(mockService.editAssistant).toHaveBeenCalledWith({ assistant: storedAssistant, editParams });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit an assistant' });
        expect(mockRepository.getAssistantById).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit an assistant' });
        expect(mockRepository.getAssistantById).not.toHaveBeenCalled();
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams({ name: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A name is required to edit an assistant' });
    });

    it('should fail when the sampler does not exist', async () => {
        mockSamplerRepository.getSamplerById.mockResolvedValue({ success: true, sampler: undefined });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: sampler-2 from Samplers' });
        expect(mockRepository.getAssistantById).not.toHaveBeenCalled();
    });

    it('should fail when the connection does not exist', async () => {
        mockConnectionRepository.getConnectionById.mockResolvedValue({ success: true, connection: undefined });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: connection-2 from Connections' });
        expect(mockRepository.getAssistantById).not.toHaveBeenCalled();
    });

    it('should accept a system default sampler', async () => {
        mockSamplerRepository.getSamplerById.mockResolvedValue({ success: true, sampler: undefined });
        mockGetSamplersService.findSystemDefaultSampler.mockReturnValue(createSamplerHelper({ systemDefault: true }));

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should fail when the assistant cannot be loaded', async () => {
        mockRepository.getAssistantById.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockService.editAssistant).not.toHaveBeenCalled();
    });

    it('should fail when the assistant does not exist', async () => {
        mockRepository.getAssistantById.mockResolvedValue({ success: true, assistant: undefined });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Assistant with id assistant-1 not found' });
    });

    it('should return the service error', async () => {
        mockService.editAssistant.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should return a fallback error when the service fails without one', async () => {
        mockService.editAssistant.mockReturnValue({ success: false });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on EditAssistantService' });
    });

    it('should fail when the service succeeds without a result', async () => {
        mockService.editAssistant.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Success is true but does not have an assistant' });
    });

    it('should fail when the list cannot be loaded', async () => {
        mockRepository.getAssistants.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockRepository.editAssistant).not.toHaveBeenCalled();
    });

    it('should fail when the list is missing', async () => {
        mockRepository.getAssistants.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response.success).toBe(false);
        expect(mockRepository.editAssistant).not.toHaveBeenCalled();
    });

    it('should fail when another entry already has the edited name', async () => {
        mockRepository.getAssistants.mockResolvedValue({
            success: true,
            assistants: [createAssistantHelper({ id: 'assistant-2', name: 'Edited name' })]
        });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Assistant with name Edited name already exists' });
        expect(mockRepository.editAssistant).not.toHaveBeenCalled();
    });

    it('should accept the name of the entry being edited', async () => {
        mockRepository.getAssistants.mockResolvedValue({ success: true, assistants: [editedAssistant] });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should treat names that differ only by case as different names', async () => {
        mockRepository.getAssistants.mockResolvedValue({
            success: true,
            assistants: [createAssistantHelper({ id: 'assistant-2', name: 'edited NAME' })]
        });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should return the repository error when saving fails', async () => {
        mockRepository.editAssistant.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when saving fails without one', async () => {
        mockRepository.editAssistant.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'assistant-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to edit assistant' });
    });
});
