import { ItemEditParams } from '../services';

export interface IEditItemController {
    handle (params: EditItemControllerParams): Promise<EditItemControllerResponse>;
}

export type EditItemControllerParams = {
    id: string;
    editParams: ItemEditParams;
};

export type EditItemControllerResponse = {
    id?: string;
    success: boolean;
    error?: string;
};
