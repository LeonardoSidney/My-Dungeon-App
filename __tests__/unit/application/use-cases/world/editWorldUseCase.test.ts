import { EditWorldUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IWorldRepository } from '@domain/repository';
import { WorldEditParams, IEditWorldService } from '@domain/services';
import { createWorldHelper } from '@test/helpers';

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
    getWorldById: jest.fn(),
    getWorlds: jest.fn(),
    editWorld: jest.fn()
};

const mockService = {
    editWorld: jest.fn()
};

const storedWorld = createWorldHelper({ id: 'world-1', name: 'Stored name' });
const editedWorld = createWorldHelper({ id: 'world-1', name: 'Edited name' });

function createEditParams (overrides?: Partial<WorldEditParams>): WorldEditParams {
    return {
        name: 'Edited name',
        activationWord: 'activate',
        prompt: 'A prompt',
        ...overrides
    };
}

function buildUseCase (): EditWorldUseCase {
    return new EditWorldUseCase(
        mockLogger,
        mockService as unknown as IEditWorldService,
        mockRepository as unknown as IWorldRepository
    );
}

describe('EditWorldUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.getWorldById.mockResolvedValue({ success: true, world: storedWorld });
        mockRepository.getWorlds.mockResolvedValue({ success: true, worlds: [storedWorld] });
        mockRepository.editWorld.mockResolvedValue({ success: true });
        mockService.editWorld.mockReturnValue({ success: true, world: editedWorld });
    });

    it('should save the edited world and return its id', async () => {
        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams() });

        expect(mockRepository.editWorld).toHaveBeenCalledWith({ world: editedWorld });
        expect(response).toEqual({ success: true, id: 'world-1' });
    });

    it('should pass the stored world and the editParams to the service', async () => {
        const editParams = createEditParams();

        await buildUseCase().execute({ id: 'world-1', editParams });

        expect(mockService.editWorld).toHaveBeenCalledWith({ world: storedWorld, editParams });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit a world' });
        expect(mockRepository.getWorldById).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit a world' });
        expect(mockRepository.getWorldById).not.toHaveBeenCalled();
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams({ name: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A name is required to edit a world' });
    });

    it('should fail when the activationWord is blank', async () => {
        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams({ activationWord: '   ' }) });

        expect(response).toEqual({ success: false, error: 'An activation word is required to edit a world' });
    });

    it('should fail when the prompt is blank', async () => {
        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams({ prompt: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A prompt is required to edit a world' });
    });

    it('should fail when the world cannot be loaded', async () => {
        mockRepository.getWorldById.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockService.editWorld).not.toHaveBeenCalled();
    });

    it('should fail when the world does not exist', async () => {
        mockRepository.getWorldById.mockResolvedValue({ success: true, world: undefined });

        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'World with id world-1 not found' });
    });

    it('should return the service error', async () => {
        mockService.editWorld.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should return a fallback error when the service fails without one', async () => {
        mockService.editWorld.mockReturnValue({ success: false });

        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on EditWorldService' });
    });

    it('should fail when the service succeeds without a result', async () => {
        mockService.editWorld.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Success is true but does not have a world' });
    });

    it('should fail when the list cannot be loaded', async () => {
        mockRepository.getWorlds.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockRepository.editWorld).not.toHaveBeenCalled();
    });

    it('should fail when the list is missing', async () => {
        mockRepository.getWorlds.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams() });

        expect(response.success).toBe(false);
        expect(mockRepository.editWorld).not.toHaveBeenCalled();
    });

    it('should fail when another entry already has the edited name', async () => {
        mockRepository.getWorlds.mockResolvedValue({
            success: true,
            worlds: [createWorldHelper({ id: 'world-2', name: 'Edited name' })]
        });

        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'World with name Edited name already exists' });
        expect(mockRepository.editWorld).not.toHaveBeenCalled();
    });

    it('should accept the name of the entry being edited', async () => {
        mockRepository.getWorlds.mockResolvedValue({ success: true, worlds: [editedWorld] });

        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should treat names that differ only by case as different names', async () => {
        mockRepository.getWorlds.mockResolvedValue({
            success: true,
            worlds: [createWorldHelper({ id: 'world-2', name: 'edited NAME' })]
        });

        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should return the repository error when saving fails', async () => {
        mockRepository.editWorld.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when saving fails without one', async () => {
        mockRepository.editWorld.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'world-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to edit world' });
    });
});
