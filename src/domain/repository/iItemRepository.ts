import { Item } from '../entities';

export interface IItemRepository {
    saveItem (params: SaveItemParams): Promise<boolean>;
    getItems (): Promise<Item[]>;
    getItemById (itemId: string): Promise<Item | undefined>;
}

export type SaveItemParams = {
    item: Item;
};
