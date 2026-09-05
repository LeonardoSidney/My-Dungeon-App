import { Item } from '../entities';
import { ItemEditParams } from '../services';

export interface IEditItemController {
    handle (params: EditItemControllerParams): Promise<EditItemControllerResponse>;
}

export type EditItemControllerParams = {
    id: string;
    editParams: ItemEditParams;
};

export type EditItemControllerResponse = {
    item?: Item;
    success: boolean;
    error?: string;
};
