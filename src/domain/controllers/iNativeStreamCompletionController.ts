import { Connection, Sampler } from '../entities';

export interface INativeStreamCompletionController {
    handle(request: NativeStreamCompletionControllerRequest): Promise<NativeStreamCompletionControllerResponse>;
}

export type NativeStreamCompletionControllerRequest = {
    connection: Connection;
    sampler: Sampler;
    modelId: string;
    prompt: string;
};

export type NativeStreamCompletionControllerResponse = {
    success: boolean;
    stream?: AsyncIterable<string>;
    abort?: () => void;
    error?: string;
};
