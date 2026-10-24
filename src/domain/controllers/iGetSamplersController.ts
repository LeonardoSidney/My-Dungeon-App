import { ListControllerResponse, SamplerListItem } from './iCrudControllerResponses';

export interface IGetSamplersController {
    handle (): Promise<GetSamplersControllerResponse>;
}

export type GetSamplersControllerResponse = ListControllerResponse<SamplerListItem>;
