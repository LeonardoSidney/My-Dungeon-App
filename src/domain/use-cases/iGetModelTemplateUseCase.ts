import { Connection, ModelTemplate } from '../entities';

export interface IGetModelTemplateUseCase {
    execute (params: GetModelTemplateUseCaseParams): Promise<GetModelTemplateUseCaseResponse>;
}

export type GetModelTemplateUseCaseParams = {
    connection: Connection;
    modelId: string;
};

export type GetModelTemplateUseCaseResponse = {
    success: boolean;
    modelTemplate?: ModelTemplate;
    error?: string;
};
