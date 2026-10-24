import { ListControllerResponse, EntityOption } from './iCrudControllerResponses';

export interface IGetAssistantsController {
    handle (): Promise<GetAssistantsControllerResponse>;
}

export type GetAssistantsControllerResponse = ListControllerResponse<EntityOption>;
