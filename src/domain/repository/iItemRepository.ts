import { Item } from '../entities';

export interface IItemRepository {
    saveItem (params: SaveItemParams): Promise<SaveItemRepositoryReturn>;
    getItems (): Promise<GetItemsRepositoryReturn>;
    getItemById (itemId: string): Promise<GetItemByIdRepositoryReturn>;
    editItem (params: EditItemParams): Promise<EditItemReturn>;
    eraseItem (itemId: string): Promise<EraseItemReturn>;
}

export type SaveItemParams = {
    item: Item;
};

export type EditItemParams = {
    item: Item;
};

export type SaveItemRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetItemsRepositoryReturn = {
    success: boolean;
    items?: Item[];
    error?: string;
};

export type GetItemByIdRepositoryReturn = {
    success: boolean;
    item?: Item;
    error?: string;
};

export type EditItemReturn = {
    success: boolean;
    error?: string;
};

export type EraseItemReturn = {
    success: boolean;
    error?: string;
};
