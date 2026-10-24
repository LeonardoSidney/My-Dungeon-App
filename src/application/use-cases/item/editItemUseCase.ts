import { ILogger } from '@domain/logger';
import { IItemRepository } from '@domain/repository';
import { IEditItemService } from '@domain/services';
import { EditItemParams, EditItemReturn, IEditItemUseCase } from '@domain/use-cases';

export class EditItemUseCase implements IEditItemUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditItemService,
        private readonly itemRepository: IItemRepository
    ) { }

    async execute (params: EditItemParams): Promise<EditItemReturn> {
        this.logger.info('Executing EditItemUseCase::execute');
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }

        const { id, editParams } = params;
        const itemResponse = await this.itemRepository.getItemById(id);
        if (!itemResponse.success) {
            this.logger.warning('EditItemUseCase::execute - failed to load item', itemResponse.error);
            return { success: false, error: itemResponse.error };
        }

        const item = itemResponse.item;
        if (!item) {
            return {
                success: false,
                error: `Item with id ${id} not found`
            };
        }

        this.logger.debug('Calling EditItemService', { id, editParams });
        const response = this.service.editItem({ item, editParams });
        this.logger.debug('EditItemService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred on EditItemService'
            };
        }

        if (!response.item) {
            return {
                success: false,
                error: 'Success is true but does not have an item'
            };
        }

        const editedItem = response.item;
        const existingItemsResponse = await this.itemRepository.getItems();
        if (!existingItemsResponse.success || !existingItemsResponse.items) {
            this.logger.warning('EditItemUseCase::execute - failed to load items', existingItemsResponse.error);
            return { success: false, error: existingItemsResponse.error };
        }

        const existingItems = existingItemsResponse.items;
        const duplicateItem = existingItems.find(
            (i) => i.name === editedItem.name && i.id !== editedItem.id
        );

        if (duplicateItem) {
            this.logger.warning(`Item with name ${editedItem.name} already exists`);
            return {
                success: false,
                error: `Item with name ${editedItem.name} already exists`
            };
        }

        const editResult = await this.itemRepository.editItem({ item: editedItem });
        if (!editResult.success) {
            return {
                success: false,
                error: editResult.error || 'Failed to edit item'
            };
        }

        return {
            id: editedItem.id,
            success: true
        };
    }

    private validate (params: EditItemParams): string | null {
        if (!params.id) {
            return 'An id is required to edit an item';
        }

        if (!params.editParams.name?.trim()) {
            return 'A name is required to edit an item';
        }

        if (!params.editParams.activationWord?.trim()) {
            return 'An activation word is required to edit an item';
        }

        if (!params.editParams.prompt?.trim()) {
            return 'A prompt is required to edit an item';
        }

        return null;
    }
}
