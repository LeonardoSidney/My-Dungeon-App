import type { HydratedAdventure } from '@domain/use-cases';

export interface INativeStreamCompletionController {
    handle (request: NativeStreamCompletionControllerRequest): Promise<NativeStreamCompletionControllerResponse>;
}

export type NativeStreamCompletionControllerRequest = {
    adventureId?: string;
    connectionId: string;
    samplerId: string;
    modelId: string;
    prompt: string;
    hydrated?: HydratedAdventure;
};

export type NativeStreamCompletionControllerResponse = {
    success: boolean;
    stream?: AsyncIterable<string>;
    abort?: () => void;
    error?: string;
};
