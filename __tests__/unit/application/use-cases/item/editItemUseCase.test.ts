import { EditItemUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IItemRepository } from '@domain/repository';
import { ItemEditParams, IEditItemService } from '@domain/services';
import { createItemHelper } from '@test/helpers';

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
    getItemById: jest.fn(),
    getItems: jest.fn(),
    editItem: jest.fn()
};

const mockService = {
    editItem: jest.fn()
};

const storedItem = createItemHelper({ id: 'item-1', name: 'Stored name' });
const editedItem = createItemHelper({ id: 'item-1', name: 'Edited name' });

function createEditParams (overrides?: Partial<ItemEditParams>): ItemEditParams {
    return {
        name: 'Edited name',
        activationWord: 'activate',
        prompt: 'A prompt',
        ...overrides
    };
}

function buildUseCase (): EditItemUseCase {
    return new EditItemUseCase(
        mockLogger,
        mockService as unknown as IEditItemService,
        mockRepository as unknown as IItemRepository
    );
}

describe('EditItemUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.getItemById.mockResolvedValue({ success: true, item: storedItem });
        mockRepository.getItems.mockResolvedValue({ success: true, items: [storedItem] });
        mockRepository.editItem.mockResolvedValue({ success: true });
        mockService.editItem.mockReturnValue({ success: true, item: editedItem });
    });

    it('should save the edited item and return its id', async () => {
        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams() });

        expect(mockRepository.editItem).toHaveBeenCalledWith({ item: editedItem });
        expect(response).toEqual({ success: true, id: 'item-1' });
    });

    it('should pass the stored item and the editParams to the service', async () => {
        const editParams = createEditParams();

        await buildUseCase().execute({ id: 'item-1', editParams });

        expect(mockService.editItem).toHaveBeenCalledWith({ item: storedItem, editParams });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit an item' });
        expect(mockRepository.getItemById).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An id is required to edit an item' });
        expect(mockRepository.getItemById).not.toHaveBeenCalled();
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams({ name: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A name is required to edit an item' });
    });

    it('should fail when the activationWord is blank', async () => {
        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams({ activationWord: '   ' }) });

        expect(response).toEqual({ success: false, error: 'An activation word is required to edit an item' });
    });

    it('should fail when the prompt is blank', async () => {
        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams({ prompt: '   ' }) });

        expect(response).toEqual({ success: false, error: 'A prompt is required to edit an item' });
    });

    it('should fail when the item cannot be loaded', async () => {
        mockRepository.getItemById.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockService.editItem).not.toHaveBeenCalled();
    });

    it('should fail when the item does not exist', async () => {
        mockRepository.getItemById.mockResolvedValue({ success: true, item: undefined });

        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Item with id item-1 not found' });
    });

    it('should return the service error', async () => {
        mockService.editItem.mockReturnValue({ success: false, error: 'Service failed' });

        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Service failed' });
    });

    it('should return a fallback error when the service fails without one', async () => {
        mockService.editItem.mockReturnValue({ success: false });

        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'An unknown error occurred on EditItemService' });
    });

    it('should fail when the service succeeds without a result', async () => {
        mockService.editItem.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Success is true but does not have an item' });
    });

    it('should fail when the list cannot be loaded', async () => {
        mockRepository.getItems.mockResolvedValue({ success: false, error: 'Failed to load' });

        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to load' });
        expect(mockRepository.editItem).not.toHaveBeenCalled();
    });

    it('should fail when the list is missing', async () => {
        mockRepository.getItems.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams() });

        expect(response.success).toBe(false);
        expect(mockRepository.editItem).not.toHaveBeenCalled();
    });

    it('should fail when another entry already has the edited name', async () => {
        mockRepository.getItems.mockResolvedValue({
            success: true,
            items: [createItemHelper({ id: 'item-2', name: 'Edited name' })]
        });

        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Item with name Edited name already exists' });
        expect(mockRepository.editItem).not.toHaveBeenCalled();
    });

    it('should accept the name of the entry being edited', async () => {
        mockRepository.getItems.mockResolvedValue({ success: true, items: [editedItem] });

        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should treat names that differ only by case as different names', async () => {
        mockRepository.getItems.mockResolvedValue({
            success: true,
            items: [createItemHelper({ id: 'item-2', name: 'edited NAME' })]
        });

        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams() });

        expect(response.success).toBe(true);
    });

    it('should return the repository error when saving fails', async () => {
        mockRepository.editItem.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when saving fails without one', async () => {
        mockRepository.editItem.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'item-1', editParams: createEditParams() });

        expect(response).toEqual({ success: false, error: 'Failed to edit item' });
    });
});
