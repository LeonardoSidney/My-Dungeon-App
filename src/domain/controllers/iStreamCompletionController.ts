import { Connection, Sampler } from '../entities';

export interface IStreamCompletionController {
    handle(request: StreamCompletionControllerRequest): Promise<StreamCompletionControllerResponse>;
}

export type StreamCompletionControllerRequest = {
    connection: Connection;
    sampler: Sampler;
    modelId: string;
    prompt: string;
};

export type StreamCompletionControllerResponse = {
    success: boolean;
    stream?: AsyncIterable<string>;
    abort?: () => void;
    error?: string;
};
