import { Location } from '../entities';

export interface ILocationRepository {
    saveLocation (params: SaveLocationParams): Promise<boolean>;
    getLocations (): Promise<Location[]>;
    getLocationById (locationId: string): Promise<Location | undefined>;
    editLocation (params: EditLocationParams): Promise<EditLocationReturn>;
    eraseLocation (locationId: string): Promise<EraseLocationReturn>;
}

export type SaveLocationParams = {
    location: Location;
};

export type EditLocationParams = {
    location: Location;
};

export type EditLocationReturn = {
    success: boolean;
    error?: string;
};

export type EraseLocationReturn = {
    success: boolean;
    error?: string;
};
