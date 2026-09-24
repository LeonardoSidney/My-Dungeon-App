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

    export type StreamCompletionParams = {
        connection: Connection;
        sampler: Sampler;
        modelId: string;
        prompt: string;
    };
}

export interface IModelProviderGateway {
    getModels (connection: Connection): Promise<Model[] | null>;
    getProps (params: ModelProviderGateway.GetPropsParams): Promise<ModelProviderGateway.ModelProps | null>;
    applyTemplate (params: ModelProviderGateway.ApplyTemplateParams): Promise<string | null>;
    streamCompletion (params: ModelProviderGateway.StreamCompletionParams): ModelProviderGateway.StreamResult;
}
