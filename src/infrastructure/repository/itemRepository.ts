import { ITEM_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Item } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IItemRepository, SaveItemParams } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { ItemDTO } from '@infra/dto';

export class ItemRepository implements IItemRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

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
}
