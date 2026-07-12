import { GetModelResponseDTO } from '../../infrastructure/http/llama-cpp/dto/getModelResponseDTO';
import { ApplyTemplateResponseDTO } from '../../infrastructure/http/llama-cpp/dto/applyTemplateResponseDTO';
import { Chat, Connection } from '../entities';

export interface IModelProviderGateway {
    getModels(connection: Connection): Promise<GetModelResponseDTO | null>;
    applyTemplate(connection: Connection, modelId: string, systemPrompt: string, chat: Chat[]): Promise<ApplyTemplateResponseDTO | null>;
    streamCompletion(
        connection: Connection,
        params: {
            modelId: string;
            prompt: string;
            temperature?: number;
            topP?: number;
            maxTokens?: number;
        }
    ): AsyncIterable<string>;
}
