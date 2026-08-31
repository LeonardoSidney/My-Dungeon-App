import { Location } from '../entities';

export interface ILocationRepository {
    saveLocation (params: SaveLocationParams): Promise<boolean>;
    getLocations (): Promise<Location[]>;
    getLocationById (locationId: string): Promise<Location | undefined>;
}

export type SaveLocationParams = {
    location: Location;
};
