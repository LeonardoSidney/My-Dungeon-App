import { Location } from '../entities';

export interface ILocationRepository {
    saveLocation (params: SaveLocationParams): Promise<SaveLocationRepositoryReturn>;
    getLocations (): Promise<GetLocationsRepositoryReturn>;
    getLocationById (locationId: string): Promise<GetLocationByIdRepositoryReturn>;
    editLocation (params: EditLocationParams): Promise<EditLocationReturn>;
    eraseLocation (locationId: string): Promise<EraseLocationReturn>;
}

export type SaveLocationParams = {
    location: Location;
};

export type EditLocationParams = {
    location: Location;
};

export type SaveLocationRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetLocationsRepositoryReturn = {
    success: boolean;
    locations?: Location[];
    error?: string;
};

export type GetLocationByIdRepositoryReturn = {
    success: boolean;
    location?: Location;
    error?: string;
};

export type EditLocationReturn = {
    success: boolean;
    error?: string;
};

export type EraseLocationReturn = {
    success: boolean;
    error?: string;
};
