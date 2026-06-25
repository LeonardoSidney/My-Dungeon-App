import { Connection, Model } from "../entities";

export interface IGetModelsFromProviderUseCase {
    execute(params: GetModelsFromProviderParamsUseCase): Promise<GetModelsFromProviderParamsReturn>;
}

export type GetModelsFromProviderParamsUseCase = {
    connection: Connection;
};

export type GetModelsFromProviderParamsReturn = {
    success: boolean;
    models?: Model[];
    error?: string;
};
