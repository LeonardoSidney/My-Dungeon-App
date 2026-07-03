import { Item } from '../entities';

export interface IGetItemsUseCase {
    execute(): Promise<Item[]>;
}
