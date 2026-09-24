import { Connection, ModelTemplate } from '../entities';

export interface IGetModelTemplateService {
    fetchModelTemplate (params: FetchModelTemplateServiceParams): Promise<FetchModelTemplateServiceResponse>;
    buildModelTemplate (params: BuildModelTemplateServiceParams): ModelTemplate;
}

export type FetchModelTemplateServiceParams = {
    connection: Connection;
    modelId: string;
};

export type FetchModelTemplateServiceResponse = {
    success: boolean;
    template?: string;
    error?: string;
};

export type BuildModelTemplateServiceParams = {
    modelId: string;
    connection: string;
    template: string;
    cached?: ModelTemplate;
};
