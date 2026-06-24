import { Connection, Model } from "../entities";

export interface IGetModelsController {
    handle(request: IGetModelsControllerRequest): Promise<IGetModelsControllerResponse>;
}

export type IGetModelsControllerRequest = {
    connection: Connection
}

export type IGetModelsControllerResponse = {
    success: boolean;
    models?: Model[];
    error?: string;
}
