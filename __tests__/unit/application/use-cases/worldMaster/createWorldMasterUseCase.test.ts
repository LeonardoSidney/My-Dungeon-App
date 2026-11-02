import { CreateWorldMasterUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IAssistantRepository, IWorldMasterRepository } from '@domain/repository';
import { ICreateWorldMasterService } from '@domain/services';
import { CreateWorldMasterUseCaseParams } from '@domain/use-cases';
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

const mockWorldMasterRepository = {
    getWorldMasters: jest.fn(),
    saveWorldMaster: jest.fn()
};

const mockAssistantRepository = {
    getAssistantById: jest.fn()
};

const mockService = {
    createWorldMaster: jest.fn()
};

const createdWorldMaster = createWorldMasterHelper({ id: 'world-master-1', name: 'Keeper' });

function createParams (overrides?: Partial<CreateWorldMasterUseCaseParams>): CreateWorldMasterUseCaseParams {
    return {
        name: 'Keeper',
        activationWord: 'keeper',
        prompt: 'Narrate the dungeon',
        assistantId: 'assistant-1',
        ...overrides
    };
}

function buildUseCase (): CreateWorldMasterUseCase {
    return new CreateWorldMasterUseCase(
        mockLogger,
        mockWorldMasterRepository as unknown as IWorldMasterRepository,
        mockService as unknown as ICreateWorldMasterService,
        mockAssistantRepository as unknown as IAssistantRepository
    );
}

describe('CreateWorldMasterUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAssistantRepository.getAssistantById.mockResolvedValue({ success: true, assistant: createAssistantHelper() });
        mockWorldMasterRepository.getWorldMasters.mockResolvedValue({ success: true, worldMasters: [] });
        mockWorldMasterRepository.saveWorldMaster.mockResolvedValue({ success: true });
        mockService.createWorldMaster.mockReturnValue({ success: true, worldMaster: createdWorldMaster });
    });

    it('should save the created world master and return its id', async () => {
        const response = await buildUseCase().execute(createParams());

        expect(mockWorldMasterRepository.saveWorldMaster).toHaveBeenCalledWith({ worldMaster: createdWorldMaster });
        expect(response).toEqual({ success: true, id: 'world-master-1' });
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute(createParams({ name: '   ' }));

        expect(response).toEqual({ success: false, error: 'Name is required to create a world master' });
    });

    it('should fail when the prompt is blank', async () => {
        const response = await buildUseCase().execute(createParams({ prompt: '   ' }));

        expect(response).toEqual({ success: false, error: 'Prompt is required to create a world master' });
    });

    it('should fail when the activation word is blank', async () => {
        const response = await buildUseCase().execute(createParams({ activationWord: '   ' }));

        expect(response).toEqual({ success: false, error: 'Activation word is required to create a world master' });
    });

    it('should fail when the assistant does not exist', async () => {
        mockAssistantRepository.getAssistantById.mockResolvedValue({ success: true, assistant: undefined });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Entity not found for id: assistant-1 from Assistants' });
        expect(mockService.createWorldMaster).not.toHaveBeenCalled();
    });

    it('should return the service error', async () => {
        mockService.createWorldMaster.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should fail when the service succeeds without a world master', async () => {
        mockService.createWorldMaster.mockReturnValue({ success: true });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Something went wrong when tried to create the world master' });
    });

    it('should fail when the world masters cannot be loaded', async () => {
        mockWorldMasterRepository.getWorldMasters.mockResolvedValue({ success: false, error: 'Failed to load world masters' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Failed to load world masters' });
        expect(mockWorldMasterRepository.saveWorldMaster).not.toHaveBeenCalled();
    });

    it('should fail when the world masters list is missing', async () => {
        mockWorldMasterRepository.getWorldMasters.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute(createParams());

        expect(response.success).toBe(false);
        expect(mockWorldMasterRepository.saveWorldMaster).not.toHaveBeenCalled();
    });

    it('should fail when a world master with the same name already exists', async () => {
        mockWorldMasterRepository.getWorldMasters.mockResolvedValue({
            success: true,
            worldMasters: [createWorldMasterHelper({ id: 'world-master-2', name: 'Keeper' })]
        });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'World master with name Keeper already exists' });
        expect(mockWorldMasterRepository.saveWorldMaster).not.toHaveBeenCalled();
    });

    it('should return the repository error when saving fails', async () => {
        mockWorldMasterRepository.saveWorldMaster.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute(createParams());

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });
});
