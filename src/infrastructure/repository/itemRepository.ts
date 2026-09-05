import { ITEM_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Item } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IItemRepository, SaveItemParams, EditItemParams, EditItemReturn, EraseItemReturn } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { ItemDTO } from '@infra/dto';

export class ItemRepository implements IItemRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private async findItemIndex (items: Item[], itemId: string): Promise<number> {
        return items.findIndex((i) => i.id === itemId);
    }

    private replaceAt (items: Item[], index: number, newItem: Item): Item[] {
        items[index] = newItem;
        return items;
    }

    private removeAt (items: Item[], index: number): Item[] {
        items.splice(index, 1);
        return items;
    }

    async saveItem (params: SaveItemParams): Promise<boolean> {
        this.logger.info('Executing ItemRepository::saveItem');
        this.logger.debug('Executing ItemRepository::saveItem - params: ', params);

        try {
            const { item } = params;
            const existingData = await this.storage.load<Item[]>(`${STORAGE_NAMESPACE}/${ITEM_STORAGE_NAMESPACE}`);
            const items: Item[] = existingData ? [...existingData, item] : [item];
            await this.storage.save(`${STORAGE_NAMESPACE}/${ITEM_STORAGE_NAMESPACE}`, items);
        } catch (error) {
            this.logger.error('Error on ItemRepository::saveItem', error);
            throw error;
        }

        return true;
    }

    async getItemById (itemId: string): Promise<Item | undefined> {
        this.logger.info('Executing ItemRepository::getItemById');
        const items = await this.getItems();
        return items.find((i) => i.id === itemId);
    }

    async getItems (): Promise<Item[]> {
        this.logger.info('Executing ItemRepository::getItems');
        try {
            const items: Item[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${ITEM_STORAGE_NAMESPACE}`);
            this.logger.debug('Executing ItemRepository::getItems - rawData: ', rawData);

            if (rawData) {
                const itemsDTO: ItemDTO[] = [];
                for (const itemUnknown of rawData) {
                    const item = ItemDTO.fromStorage(itemUnknown);
                    if (item) {
                        itemsDTO.push(item);
                    }
                }

                items.push(...itemsDTO.map((dto) => dto.toEntity()));

                if (rawData.length !== items.length) {
                    this.logger.warning('Some items were not converted to entity');
                }
            }

            this.logger.debug('Executing ItemRepository::getItems - items: ', items);

            return items;
        } catch (error) {
            this.logger.error('Error on ItemRepository getItems', error);
            throw error;
        }
    }

    async editItem (params: EditItemParams): Promise<EditItemReturn> {
        this.logger.info('Executing ItemRepository::editItem');
        this.logger.debug('Executing ItemRepository::editItem - params: ', params);

        try {
            const { item } = params;
            const existingData = await this.storage.load<Item[]>(`${STORAGE_NAMESPACE}/${ITEM_STORAGE_NAMESPACE}`);
            const items = existingData || [];
            const index = await this.findItemIndex(items, item.id);

            if (index === -1) {
                this.logger.warning(`Item with id ${item.id} not found`);
                return { success: false, error: `Item with id ${item.id} does not exist` };
            }

            const updatedItems = this.replaceAt(items, index, item);
            await this.storage.save(`${STORAGE_NAMESPACE}/${ITEM_STORAGE_NAMESPACE}`, updatedItems);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on ItemRepository::editItem', error);
            return { success: false, error: 'Failed to edit item' };
        }
    }

    async eraseItem (itemId: string): Promise<EraseItemReturn> {
        this.logger.info('Executing ItemRepository::eraseItem');
        this.logger.debug('Executing ItemRepository::eraseItem - itemId: ', itemId);

        try {
            const existingData = await this.storage.load<Item[]>(`${STORAGE_NAMESPACE}/${ITEM_STORAGE_NAMESPACE}`);
            const items = existingData || [];
            const index = await this.findItemIndex(items, itemId);

            if (index === -1) {
                this.logger.warning(`Item with id ${itemId} not found`);
                return { success: false, error: `Item with id ${itemId} does not exist` };
            }

            const filteredItems = this.removeAt(items, index);
            await this.storage.save(`${STORAGE_NAMESPACE}/${ITEM_STORAGE_NAMESPACE}`, filteredItems);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on ItemRepository::eraseItem', error);
            return { success: false, error: 'Failed to erase item' };
        }
    }
}
