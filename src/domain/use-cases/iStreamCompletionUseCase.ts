import { Connection, Sampler } from '../entities';

export interface IStreamCompletionUseCase {
    execute(params: StreamCompletionUseCaseParams): Promise<StreamCompletionUseCaseResponse>;
}

export type StreamCompletionUseCaseParams = {
    connection: Connection;
    sampler: Sampler;
    modelId: string;
    prompt: string;
};

export type StreamCompletionUseCaseResponse = {
    success: boolean;
    stream?: AsyncIterable<string>;
    abort?: () => void;
    error?: string;
};
