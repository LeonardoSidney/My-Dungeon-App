export interface IStreamCompletionController {
    handle (request: StreamCompletionControllerRequest): Promise<StreamCompletionControllerResponse>;
}

export type StreamCompletionControllerRequest = {
    connectionId: string;
    samplerId: string;
    modelId: string;
    prompt: string;
};

export type StreamCompletionControllerResponse = {
    success: boolean;
    stream?: AsyncIterable<string>;
    abort?: () => void;
    error?: string;
};
