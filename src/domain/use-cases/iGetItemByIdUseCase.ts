import { Item } from '../entities';

export interface IGetItemByIdUseCase {
    execute (params: GetItemByIdUseCaseParams): Promise<GetItemByIdUseCaseReturn>;
}

export type GetItemByIdUseCaseParams = {
    id: string;
};

export type GetItemByIdUseCaseReturn = {
    success: boolean;
    item?: Item;
    error?: string;
};
