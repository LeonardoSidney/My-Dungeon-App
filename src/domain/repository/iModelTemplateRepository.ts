import { ModelTemplate } from '../entities';

export interface IModelTemplateRepository {
    getModelTemplate (params: GetModelTemplateRepositoryParams): Promise<GetModelTemplateRepositoryReturn>;
    saveModelTemplate (params: SaveModelTemplateParams): Promise<SaveModelTemplateRepositoryReturn>;
}

export type GetModelTemplateRepositoryParams = {
    modelId: string;
    connection: string;
};

export type GetModelTemplateRepositoryReturn = {
    success: boolean;
    modelTemplate?: ModelTemplate;
    error?: string;
};

export type SaveModelTemplateParams = {
    modelTemplate: ModelTemplate;
};

export type SaveModelTemplateRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetModelTemplatesReturn = {
    success: boolean;
    modelTemplates?: ModelTemplate[];
    error?: string;
};
