import { Location } from '../entities';

export type LocationEditParams = Omit<Location, 'id' | 'createdAt' | 'updatedAt'>;

export interface IEditLocationService {
    editLocation (params: EditLocationServiceParams): EditLocationServiceReturn;
}

export type EditLocationServiceParams = {
    location: Location;
    editParams: LocationEditParams;
};

export type EditLocationServiceReturn = {
    location?: Location;
    success: boolean;
    error?: string;
};
