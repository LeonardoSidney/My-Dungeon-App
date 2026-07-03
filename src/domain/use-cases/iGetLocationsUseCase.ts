import { Location } from '../entities';

export interface IGetLocationsUseCase {
    execute(): Promise<Location[]>;
}
