import { Location } from '../entities';

export interface ILocationRepository {
    saveLocation(params: SaveLocationParams): Promise<boolean>;
    getLocations(): Promise<Location[]>;
}

export type SaveLocationParams = {
    location: Location;
};
