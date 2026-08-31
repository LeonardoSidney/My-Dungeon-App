import { Chat, Connection, Model, Sampler } from '../entities';

export namespace ModelProviderGateway {
    export type StreamResult = {
        stream: AsyncIterable<string>;
        abort: () => void;
    };
}

export interface IModelProviderGateway {
    getModels(connection: Connection): Promise<Model[] | null>;
    applyTemplate(
        connection: Connection,
        modelId: string,
        systemPrompt: string,
        chat: Chat[]
    ): Promise<string | null>;
    streamCompletion(
        connection: Connection,
        sampler: Sampler,
        modelId: string,
        prompt: string
    ): ModelProviderGateway.StreamResult;
}
