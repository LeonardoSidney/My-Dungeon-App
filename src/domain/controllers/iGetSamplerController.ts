import { DetailControllerResponse, GetByIdControllerParams, SamplerDetails } from './iCrudControllerResponses';

export interface IGetSamplerController {
    handle (params: GetByIdControllerParams): Promise<GetSamplerControllerResponse>;
}

export type GetSamplerControllerResponse = DetailControllerResponse<SamplerDetails>;
