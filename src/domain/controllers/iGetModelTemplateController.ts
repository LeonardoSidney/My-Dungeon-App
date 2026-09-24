import { Connection, ModelTemplate } from '../entities';

export interface IGetModelTemplateController {
    handle (request: GetModelTemplateControllerRequest): Promise<GetModelTemplateControllerResponse>;
}

export type GetModelTemplateControllerRequest = {
    connection: Connection;
    modelId: string;
};

export type GetModelTemplateControllerResponse = {
    success: boolean;
    modelTemplate?: ModelTemplate;
    error?: string;
};
