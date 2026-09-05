import { Location } from '../entities';
import { LocationEditParams } from '../services';

export interface IEditLocationController {
    handle (params: EditLocationControllerParams): Promise<EditLocationControllerResponse>;
}

export type EditLocationControllerParams = {
    id: string;
    editParams: LocationEditParams;
};

export type EditLocationControllerResponse = {
    location?: Location;
    success: boolean;
    error?: string;
};
