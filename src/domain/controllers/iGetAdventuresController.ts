import { Adventure } from '../entities';

export interface IGetAdventuresController {
    handle(): Promise<Adventure[]>;
}
