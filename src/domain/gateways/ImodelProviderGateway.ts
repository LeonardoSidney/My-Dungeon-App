import { Chat, Connection, Model, Sampler } from '../entities';

export namespace ModelProviderGateway {
    export type StreamResult = {
        stream: AsyncIterable<string>;
        abort: () => void;
    };

    export type ModelProps = {
        chatTemplate: string | null;
        modelAlias: string | null;
        isSleeping: boolean;
    };

    export type GetPropsParams = {
        connection: Connection;
        modelId: string;
        autoload?: boolean;
    };

    export type ApplyTemplateParams = {
        connection: Connection;
        modelId: string;
        systemPrompt: string;
        chat: Chat[];
    };

    export type GetModelsResult = {
        success: boolean;
        models?: Model[];
        error?: string;
    };

    export type GetPropsResult = {
        success: boolean;
        props?: ModelProps;
        error?: string;
    };

    export type ApplyTemplateResult = {
        success: boolean;
        prompt?: string;
        error?: string;
    };

    export type StreamCompletionParams = {
        connection: Connection;
        sampler: Sampler;
        modelId: string;
        prompt: string;
    };
}

export interface IModelProviderGateway {
    getModels (connection: Connection): Promise<ModelProviderGateway.GetModelsResult>;
    getProps (params: ModelProviderGateway.GetPropsParams): Promise<ModelProviderGateway.GetPropsResult>;
    applyTemplate (params: ModelProviderGateway.ApplyTemplateParams): Promise<ModelProviderGateway.ApplyTemplateResult>;
    streamCompletion (params: ModelProviderGateway.StreamCompletionParams): ModelProviderGateway.StreamResult;
}
