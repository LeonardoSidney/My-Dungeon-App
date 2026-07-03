import { Item } from '../entities';

export interface IItemRepository {
    saveItem(params: SaveItemParams): Promise<boolean>;
    getItems(): Promise<Item[]>;
}

export type SaveItemParams = {
    item: Item;
};
