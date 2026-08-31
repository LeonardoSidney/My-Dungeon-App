export interface INativeStreamCompletionController {
    handle (request: NativeStreamCompletionControllerRequest): Promise<NativeStreamCompletionControllerResponse>;
}

export type NativeStreamCompletionControllerRequest = {
    connectionId: string;
    samplerId: string;
    modelId: string;
    prompt: string;
};

export type NativeStreamCompletionControllerResponse = {
    success: boolean;
    stream?: AsyncIterable<string>;
    abort?: () => void;
    error?: string;
};
