import { GetModelResponseDTO } from '../../infrastructure/http/llama-cpp/dto/getModelResponseDTO';
import { ApplyTemplateResponseDTO } from '../../infrastructure/http/llama-cpp/dto/applyTemplateResponseDTO';
import { Chat, Connection, Sampler } from '../entities';

export namespace ModelProviderGateway {
    export type StreamResult = {
        stream: AsyncIterable<string>;
        abort: () => void;
    };
}

export interface IModelProviderGateway {
    getModels(connection: Connection): Promise<GetModelResponseDTO | null>;
    applyTemplate(
        connection: Connection,
        modelId: string,
        systemPrompt: string,
        chat: Chat[]
    ): Promise<ApplyTemplateResponseDTO | null>;
    streamCompletion(
        connection: Connection,
        sampler: Sampler,
        modelId: string,
        prompt: string
    ): ModelProviderGateway.StreamResult;
}
