export interface IStreamPromptCompletionUseCase {
    execute (params: StreamPromptCompletionUseCaseParams): Promise<StreamPromptCompletionUseCaseResponse>;
}

export type StreamPromptCompletionUseCaseParams = {
    prompt: string;
};

export type StreamPromptCompletionUseCaseResponse = {
    success: boolean;
    stream?: AsyncIterable<string>;
    abort?: () => void;
    error?: string;
};
