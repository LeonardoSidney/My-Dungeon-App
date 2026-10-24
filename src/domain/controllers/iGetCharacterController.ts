import { DetailControllerResponse, GetByIdControllerParams, CharacterDetails } from './iCrudControllerResponses';

export interface IGetCharacterController {
    handle (params: GetByIdControllerParams): Promise<GetCharacterControllerResponse>;
}

export type GetCharacterControllerResponse = DetailControllerResponse<CharacterDetails>;
