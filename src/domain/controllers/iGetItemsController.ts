import { Item } from '../entities';

export interface IGetItemsController {
    handle(): Promise<Item[]>;
}
