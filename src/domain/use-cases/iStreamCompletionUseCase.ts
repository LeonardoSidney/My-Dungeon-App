import { Connection } from '../entities';

export interface IStreamCompletionUseCase {
    execute(params: StreamCompletionUseCaseParams): Promise<StreamCompletionUseCaseResponse>;
}

export type StreamCompletionUseCaseParams = {
    connection: Connection;
    modelId: string;
    prompt: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
};

export type StreamCompletionUseCaseResponse = {
    success: boolean;
    stream?: AsyncIterable<string>;
    error?: string;
};
