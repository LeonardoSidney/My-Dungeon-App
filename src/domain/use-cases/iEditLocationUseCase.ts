import { Location } from '../entities';
import { LocationEditParams } from '../services';

export interface IEditLocationUseCase {
    execute (request: EditLocationParams): Promise<EditLocationReturn>;
}

export type EditLocationParams = {
    id: string;
    editParams: LocationEditParams;
};

export type EditLocationReturn = {
    location?: Location;
    success: boolean;
    error?: string;
};
