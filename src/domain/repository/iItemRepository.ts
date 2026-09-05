import { Item } from '../entities';

export interface IItemRepository {
    saveItem (params: SaveItemParams): Promise<boolean>;
    getItems (): Promise<Item[]>;
    getItemById (itemId: string): Promise<Item | undefined>;
    editItem (params: EditItemParams): Promise<EditItemReturn>;
    eraseItem (itemId: string): Promise<EraseItemReturn>;
}

export type SaveItemParams = {
    item: Item;
};

export type EditItemParams = {
    item: Item;
};

export type EditItemReturn = {
    success: boolean;
    error?: string;
};

export type EraseItemReturn = {
    success: boolean;
    error?: string;
};
