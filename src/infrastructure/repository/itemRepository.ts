import { ITEM_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Item } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IItemRepository,
    SaveItemParams,
    SaveItemRepositoryReturn,
    GetItemsRepositoryReturn,
    GetItemByIdRepositoryReturn,
    EditItemParams,
    EditItemReturn,
    EraseItemReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { ItemDTO } from '@infra/dto';

export class ItemRepository implements IItemRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${ITEM_STORAGE_NAMESPACE}`;
    }

    async saveItem (params: SaveItemParams): Promise<SaveItemRepositoryReturn> {
        this.logger.info('Executing ItemRepository::saveItem');
        this.logger.storage('Executing ItemRepository::saveItem - params: ', params);

        const loaded = await this.storage.load<Item[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('ItemRepository::saveItem - failed to load items', loaded.error);
            return { success: false, error: 'Failed to save item' };
        }

        const items = [...(loaded.data ?? []), params.item];
        const saved = await this.storage.save(this.storageKey, items);
        if (!saved.success) {
            this.logger.warning('ItemRepository::saveItem - failed to persist items', saved.error);
            return { success: false, error: 'Failed to save item' };
        }

        return { success: true };
    }

    async getItemById (itemId: string): Promise<GetItemByIdRepositoryReturn> {
        this.logger.info('Executing ItemRepository::getItemById');

        const response = await this.getItems();
        if (!response.success || !response.items) {
            return { success: false, error: response.error };
        }

        return { success: true, item: response.items.find((i) => i.id === itemId) };
    }

    async getItems (): Promise<GetItemsRepositoryReturn> {
        this.logger.info('Executing ItemRepository::getItems');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('ItemRepository::getItems - failed to load items', loaded.error);
            return { success: false, error: 'Failed to load items' };
        }

        const rawData = loaded.data ?? [];
        this.logger.storage('Executing ItemRepository::getItems - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('ItemRepository::getItems - stored items are not a list');
            return { success: false, error: 'Failed to load items' };
        }

        const items: Item[] = [];
        for (const itemUnknown of rawData) {
            const dto = ItemDTO.fromStorage(itemUnknown);
            if (dto) {
                items.push(dto.toEntity());
            }
        }

        if (rawData.length !== items.length) {
            this.logger.warning('Some items were not converted to entity');
        }

        this.logger.storage('Executing ItemRepository::getItems - items: ', items);
        return { success: true, items };
    }

    async editItem (params: EditItemParams): Promise<EditItemReturn> {
        this.logger.info('Executing ItemRepository::editItem');
        this.logger.storage('Executing ItemRepository::editItem - params: ', params);

        const { item } = params;
        const loaded = await this.storage.load<Item[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('ItemRepository::editItem - failed to load items', loaded.error);
            return { success: false, error: 'Failed to edit item' };
        }

        const items = loaded.data ?? [];
        const index = items.findIndex((i) => i.id === item.id);
        if (index === -1) {
            this.logger.warning(`Item with id ${item.id} not found`);
            return { success: false, error: `Item with id ${item.id} does not exist` };
        }

        items[index] = item;
        const saved = await this.storage.save(this.storageKey, items);
        if (!saved.success) {
            this.logger.warning('ItemRepository::editItem - failed to persist items', saved.error);
            return { success: false, error: 'Failed to edit item' };
        }

        return { success: true };
    }

    async eraseItem (itemId: string): Promise<EraseItemReturn> {
        this.logger.info('Executing ItemRepository::eraseItem');
        this.logger.debug('Executing ItemRepository::eraseItem - itemId: ', itemId);

        const loaded = await this.storage.load<Item[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('ItemRepository::eraseItem - failed to load items', loaded.error);
            return { success: false, error: 'Failed to erase item' };
        }

        const items = loaded.data ?? [];
        const index = items.findIndex((i) => i.id === itemId);
        if (index === -1) {
            this.logger.warning(`Item with id ${itemId} not found`);
            return { success: false, error: `Item with id ${itemId} does not exist` };
        }

        items.splice(index, 1);
        const saved = await this.storage.save(this.storageKey, items);
        if (!saved.success) {
            this.logger.warning('ItemRepository::eraseItem - failed to persist items', saved.error);
            return { success: false, error: 'Failed to erase item' };
        }

        return { success: true };
    }
}
