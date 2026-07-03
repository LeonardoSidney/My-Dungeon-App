import { Item } from '../entities';

export interface ICreateItemController {
    handle(request: CreateItemRequest): Promise<CreateItemResponse>;
}

export type CreateItemRequest = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateItemResponse = {
    success: boolean;
    item?: Item;
    error?: string;
};
