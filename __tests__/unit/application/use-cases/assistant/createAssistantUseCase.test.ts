import { CreateAssistantUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IAssistantRepository, IConnectionRepository, ISamplerRepository } from '@domain/repository';
import { ICreateAssistantService, IGetSamplersService } from '@domain/services';
import { CreateAssistantUseCaseParams } from '@domain/use-cases';
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

const mockAssistantRepository = {
    getAssistants: jest.fn(),
    saveAssistant: jest.fn()
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

const mockService = {
    createAssistant: jest.fn()
};

const createdAssistant = createAssistantHelper({ id: 'assistant-1', name: 'Local Qwen' });

function createParams (overrides?: Partial<CreateAssistantUseCaseParams>): CreateAssistantUseCaseParams {
    return {
        name: 'Local Qwen',
        observation: 'Runs on the desktop',
        modelId: 'model-1',
        samplerId: 'sampler-1',
        connectionId: 'connection-1',
        ...overrides
    };
}

function buildUseCase (): CreateAssistantUseCase {
    return new CreateAssistantUseCase(
        mockLogger,
        mockAssistantRepository as unknown as IAssistantRepository,
        mockService as unknown as ICreateAssistantService,
        mockSamplerRepository as unknown as ISamplerRepository,
        mockGetSamplersService as unknown as IGetSamplersService,
        mockConnectionRepository as unknown as IConnectionRepository
    );
}

describe('CreateAssistantUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSamplerRepository.getSamplerById.mockResolvedValue({ success: true, sampler: createSamplerHelper() });
        mockGetSamplersService.findSystemDefaultSampler.mockReturnValue(undefined);
        mockConnectionRepository.getConnectionById.mockResolvedValue({ success: true, connection: createConnectionHelper() });
        mockAssistantRepository.getAssistants.mockResolvedValue({ success: true, assistants: [] });
        mockAssistantRepository.saveAssistant.mockResolvedValue({ success: true });
        mockService.createAssistant.mockResolvedValue({ success: true, assistant: createdAssistant });
    });

    it('should save the created assistant and return its id', async () => {
        const response = await buildUseCase().execute(createParams());

        expect(mockAssistantRepository.saveAssistant).toHaveBeenCalledWith({ assistant: createdAssistant });
        expect(response).toEqual({ success: true, id: 'assistant-1' });
    });

    it('should pass the assistant fields to the service', async () => {
        await buildUseCase().execute(createParams());

        expect(mockService.createAssistant).toHaveBeenCalledWith(createParams());
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute(createParams({ name: '   ' }));

        expect(response).toEqual({ success: false, error: 'A name is required to create an assistant' });
        expect(mockService.createAssistant).not.toHaveBeenCalled();
    });

    it('should fail when the sampler does not exist', async () => {
        mockSamplerRepository.getSamplerById.mockResolvedValue({ success: true, sampler: undefined });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Entity not found for id: sampler-1 from Samplers' });
        expect(mockService.createAssistant).not.toHaveBeenCalled();
    });

    it('should accept a system default sampler', async () => {
        mockSamplerRepository.getSamplerById.mockResolvedValue({ success: true, sampler: undefined });
        mockGetSamplersService.findSystemDefaultSampler.mockReturnValue(createSamplerHelper({ systemDefault: true }));

        const response = await buildUseCase().execute(createParams());

        expect(response.success).toBe(true);
    });

    it('should fail when the connection does not exist', async () => {
        mockConnectionRepository.getConnectionById.mockResolvedValue({ success: true, connection: undefined });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Entity not found for id: connection-1 from Connections' });
        expect(mockService.createAssistant).not.toHaveBeenCalled();
    });

    it('should return the service error', async () => {
        mockService.createAssistant.mockResolvedValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should fail when the service succeeds without an assistant', async () => {
        mockService.createAssistant.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Unexpected error: assistant is null' });
    });

    it('should fail when the assistants cannot be loaded', async () => {
        mockAssistantRepository.getAssistants.mockResolvedValue({ success: false, error: 'Failed to load assistants' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Failed to load assistants' });
        expect(mockAssistantRepository.saveAssistant).not.toHaveBeenCalled();
    });

    it('should fail when the assistants list is missing', async () => {
        mockAssistantRepository.getAssistants.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute(createParams());

        expect(response.success).toBe(false);
        expect(mockAssistantRepository.saveAssistant).not.toHaveBeenCalled();
    });

    it('should compare the name returned by the service against the existing assistants', async () => {
        mockAssistantRepository.getAssistants.mockResolvedValue({
            success: true,
            assistants: [createAssistantHelper({ id: 'assistant-2', name: 'Local Qwen' })]
        });

        const response = await buildUseCase().execute(createParams({ name: '  Local Qwen  ' }));

        expect(response).toEqual({ success: false, error: 'Assistant with this name Local Qwen already exists' });
        expect(mockAssistantRepository.saveAssistant).not.toHaveBeenCalled();
    });

    it('should return the repository error when saving fails', async () => {
        mockAssistantRepository.saveAssistant.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });
});
