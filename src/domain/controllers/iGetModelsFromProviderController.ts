import { Model } from '../entities';

export interface IGetModelsFromProviderController {
    handle(request: GetModelsControllerRequest): Promise<GetModelsControllerResponse>;
}

export type GetModelsControllerRequest = {
    connectionId: string;
};

export type GetModelsControllerResponse = {
    success: boolean;
    models?: Model[];
    error?: string;
};
