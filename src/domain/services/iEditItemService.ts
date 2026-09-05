import { Item } from '../entities';

export type ItemEditParams = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;

export interface IEditItemService {
    editItem (params: EditItemServiceParams): EditItemServiceReturn;
}

export type EditItemServiceParams = {
    item: Item;
    editParams: ItemEditParams;
};

export type EditItemServiceReturn = {
    item?: Item;
    success: boolean;
    error?: string;
};
