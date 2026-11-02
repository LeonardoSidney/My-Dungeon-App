import { EditSystemPromptUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { ISystemPromptRepository } from '@domain/repository';
import { SystemPromptEditParams, IEditSystemPromptService } from '@domain/services';
import { createSystemPromptHelper } from '@test/helpers';

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
    getSystemPromptById: jest.fn(),
    getSystemPrompts: jest.fn(),
    editSystemPrompt: jest.fn()
};

const mockService = {
    editSystemPrompt: jest.fn()
};

const storedSystemPrompt = createSystemPromptHelper({ id: 'systemPrompt-1', name: 'Stored name' });
const editedSystemPrompt = createSystemPromptHelper({ id: 'systemPrompt-1', name: 'Edited name' });

function createEditParams (overrides?: Partial<SystemPromptEditParams>): SystemPromptEditParams {
    return {
        name: 'Edited name',
        content: 'A content',
        ...overrides
    };
}

function buildUseCase (): EditSystemPromptUseCase {
    return new EditSystemPromptUseCase(
        mockLogger,
        mockService as unknown as IEditSystemPromptService,
        mockRepository as unknown as ISystemPromptRepository
    );
}

describe('EditSystemPromptUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.getSystemPromptById.mockResolvedValue({ success: true, systemPrompt: storedSystemPrompt });
        mockRepository.getSystemPrompts.mockResolvedValue({ success: true, systemPrompts: [storedSystemPrompt] });
        mockRepository.editSystemPrompt.mockResolvedValue({ success: true });
        mockService.editSystemPrompt.mockReturnValue({ success: true, systemPrompt: editedSystemPrompt });
    });

    it('should save the edited systemPrompt and return its id', async () => {
        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams() });

        expect(mockRepository.editSystemPrompt).toHaveBeenCalledWith({ systemPrompt: editedSystemPrompt });
        expect(response).toEqual({ success: true, id: 'systemPrompt-1' });
    });

    it('should pass the stored systemPrompt and the editParams to the service', async () => {
        const editParams = createEditParams();

        await buildUseCase().execute({ id: 'systemPrompt-1', editParams });

        expect(mockService.editSystemPrompt).toHaveBeenCalledWith({ systemPrompt: storedSystemPrompt, editParams });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'System prompt id is required' });
        expect(mockRepository.getSystemPromptById).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'System prompt id is required' });
        expect(mockRepository.getSystemPromptById).not.toHaveBeenCalled();
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams({ name: '   ' }) });

        expect(response).toEqual({ success: false, error: 'System prompt name is required' });
    });

    it('should fail when the content is blank', async () => {
        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams({ content: '   ' }) });

        expect(response).toEqual({ success: false, error: 'System prompt content is required' });
    });

    it('should fail when the systemPrompt cannot be loaded', async () => {
        mockRepository.getSystemPromptById.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockService.editSystemPrompt).not.toHaveBeenCalled();
    });

    it('should fail when the systemPrompt does not exist', async () => {
        mockRepository.getSystemPromptById.mockResolvedValue({ success: true, systemPrompt: undefined });

        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'System prompt with id systemPrompt-1 not found' });
    });

    it('should return the service error', async () => {
        mockService.editSystemPrompt.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should return a fallback error when the service fails without one', async () => {
        mockService.editSystemPrompt.mockReturnValue({ success: false });

        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on EditSystemPromptService' });
    });

    it('should fail when the service succeeds without a result', async () => {
        mockService.editSystemPrompt.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Success is true but does not have a systemPrompt' });
    });

    it('should fail when the list cannot be loaded', async () => {
        mockRepository.getSystemPrompts.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockRepository.editSystemPrompt).not.toHaveBeenCalled();
    });

    it('should fail when the list is missing', async () => {
        mockRepository.getSystemPrompts.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams() });

        expect(response.success).toBe(false);
        expect(mockRepository.editSystemPrompt).not.toHaveBeenCalled();
    });

    it('should fail when another entry already has the edited name', async () => {
        mockRepository.getSystemPrompts.mockResolvedValue({
            success: true,
            systemPrompts: [createSystemPromptHelper({ id: 'systemPrompt-2', name: 'Edited name' })]
        });

        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'System prompt with name Edited name already exists' });
        expect(mockRepository.editSystemPrompt).not.toHaveBeenCalled();
    });

    it('should accept the name of the entry being edited', async () => {
        mockRepository.getSystemPrompts.mockResolvedValue({ success: true, systemPrompts: [editedSystemPrompt] });

        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should treat names that differ only by case as different names', async () => {
        mockRepository.getSystemPrompts.mockResolvedValue({
            success: true,
            systemPrompts: [createSystemPromptHelper({ id: 'systemPrompt-2', name: 'edited NAME' })]
        });

        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should return the repository error when saving fails', async () => {
        mockRepository.editSystemPrompt.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when saving fails without one', async () => {
        mockRepository.editSystemPrompt.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'systemPrompt-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to edit system prompt' });
    });
});
