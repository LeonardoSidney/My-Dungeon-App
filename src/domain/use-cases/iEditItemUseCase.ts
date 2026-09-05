import { Item } from '../entities';
import { ItemEditParams } from '../services';

export interface IEditItemUseCase {
    execute (request: EditItemParams): Promise<EditItemReturn>;
}

export type EditItemParams = {
    id: string;
    editParams: ItemEditParams;
};

export type EditItemReturn = {
    item?: Item;
    success: boolean;
    error?: string;
};
