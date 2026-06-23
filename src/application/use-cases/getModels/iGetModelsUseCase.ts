import { Connection, Model } from "../../../domain/entities";

export interface IGetModelsUseCase {
    execute(params: GetModelsParamsUseCase): Promise<GetModelsParamsReturn>;
}

export type GetModelsParamsUseCase = {
    connection: Connection
}

export type GetModelsParamsReturn = {
    success: boolean;
    models?: Model[];
    error?: string;
}
