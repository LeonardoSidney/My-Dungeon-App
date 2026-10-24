import { Item } from '../entities';

export interface IGetItemsUseCase {
    execute (): Promise<GetItemsUseCaseReturn>;
}

export type GetItemsUseCaseReturn = {
    success: boolean;
    items?: Item[];
    error?: string;
};
