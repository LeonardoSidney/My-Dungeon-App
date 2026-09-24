import { ModelTemplate } from '../entities';

export interface IModelTemplateRepository {
    getModelTemplate (params: GetModelTemplateRepositoryParams): Promise<ModelTemplate | undefined>;
    saveModelTemplate (params: SaveModelTemplateParams): Promise<boolean>;
}

export type GetModelTemplateRepositoryParams = {
    modelId: string;
    connection: string;
};

export type SaveModelTemplateParams = {
    modelTemplate: ModelTemplate;
};
