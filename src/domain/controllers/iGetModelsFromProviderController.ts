import { Connection, Model } from "../entities";

export interface IGetModelsFromProviderController {
    handle(request: GetModelsControllerRequest): Promise<GetModelsControllerResponse>;
}

export type GetModelsControllerRequest = {
    connection: Connection;
};

export type GetModelsControllerResponse = {
    success: boolean;
    models?: Model[];
    error?: string;
};
