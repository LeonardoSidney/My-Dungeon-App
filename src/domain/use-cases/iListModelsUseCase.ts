import { Connection, Model } from '../entities';

export interface IListModelsUseCase {
    execute (params?: ListModelsUseCaseParams): Promise<ListModelsUseCaseReturn>;
}

export type ListModelsUseCaseParams = {
    loadedOnly?: boolean;
};

export type ListedModel = {
    model: Model;
    connection: Connection;
};

export type ListModelsUseCaseReturn = {
    success: boolean;
    models?: ListedModel[];
    error?: string;
};
