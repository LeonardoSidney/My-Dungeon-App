import { Adventure } from '../entities';
import { AdventureEditParams } from '../services';

export interface IEditAdventureController {
    handle (request: EditAdventureControllerParams): Promise<EditAdventureControllerResponse>;
}

export type EditAdventureControllerParams = {
    id: string;
    editParams: AdventureEditParams;
};

export type EditAdventureControllerResponse = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
