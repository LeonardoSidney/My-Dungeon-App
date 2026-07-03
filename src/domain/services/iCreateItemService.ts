import { Item } from '../entities';

export interface ICreateItemService {
    createItem(params: CreateItemServiceParams): CreateItemServiceResponse;
}

export type CreateItemServiceParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateItemServiceResponse = {
    success: boolean;
    item?: Item;
    error?: string;
};
