import { Model } from '../entities';

export interface IGetModelsFromProviderUseCase {
    execute(params: GetModelsFromProviderParamsUseCase): Promise<GetModelsFromProviderParamsReturn>;
}

export type GetModelsFromProviderParamsUseCase = {
    connectionId: string;
};

export type GetModelsFromProviderParamsReturn = {
    success: boolean;
    models?: Model[];
    error?: string;
};
