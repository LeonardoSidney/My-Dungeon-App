import { World } from '../entities';

export interface IGetWorldsController {
    handle(): Promise<World[]>;
}
