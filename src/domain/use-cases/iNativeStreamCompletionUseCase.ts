import { Connection, Sampler } from '../entities';

export interface INativeStreamCompletionUseCase {
    execute(params: NativeStreamCompletionUseCaseParams): Promise<NativeStreamCompletionUseCaseResponse>;
}

export type NativeStreamCompletionUseCaseParams = {
    connection: Connection;
    sampler: Sampler;
    modelId: string;
    prompt: string;
};

export type NativeStreamCompletionUseCaseResponse = {
    success: boolean;
    stream?: AsyncIterable<string>;
    abort?: () => void;
    error?: string;
};
