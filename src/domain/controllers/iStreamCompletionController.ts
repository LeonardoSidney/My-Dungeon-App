import { Connection } from '../entities';

export interface IStreamCompletionController {
    handle(request: StreamCompletionControllerRequest): Promise<StreamCompletionControllerResponse>;
}

export type StreamCompletionControllerRequest = {
    connection: Connection;
    modelId: string;
    prompt: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
};

export type StreamCompletionControllerResponse = {
    success: boolean;
    stream?: AsyncIterable<string>;
    error?: string;
};
