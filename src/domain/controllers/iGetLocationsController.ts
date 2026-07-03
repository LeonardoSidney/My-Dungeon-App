import { Location } from '../entities';

export interface IGetLocationsController {
    handle(): Promise<Location[]>;
}
