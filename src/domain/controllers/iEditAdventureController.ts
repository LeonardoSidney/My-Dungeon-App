import { MutationControllerResponse } from './iCrudControllerResponses';
import { AdventureFormRequest } from './iCreateAdventureController';

export interface IEditAdventureController {
    handle (request: EditAdventureControllerParams): Promise<EditAdventureControllerResponse>;
}

export type EditAdventureControllerParams = {
    id: string;
    editParams: AdventureFormRequest;
};

export type EditAdventureControllerResponse = MutationControllerResponse;
