import type { HydratedAdventure } from '../services/iHydrateAdventureService';

export interface INativeStreamCompletionUseCase {
    execute (params: NativeStreamCompletionUseCaseParams): Promise<NativeStreamCompletionUseCaseResponse>;
}

export type NativeStreamCompletionUseCaseParams = {
    adventureId?: string;
    connectionId: string;
    samplerId: string;
    modelId: string;
    prompt: string;
    hydrated?: HydratedAdventure;
};

export type NativeStreamCompletionUseCaseResponse = {
    success: boolean;
    stream?: AsyncIterable<string>;
    abort?: () => void;
    error?: string;
};
