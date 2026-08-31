export interface INativeStreamCompletionUseCase {
    execute (params: NativeStreamCompletionUseCaseParams): Promise<NativeStreamCompletionUseCaseResponse>;
}

export type NativeStreamCompletionUseCaseParams = {
    connectionId: string;
    samplerId: string;
    modelId: string;
    prompt: string;
};

export type NativeStreamCompletionUseCaseResponse = {
    success: boolean;
    stream?: AsyncIterable<string>;
    abort?: () => void;
    error?: string;
};
