import type { HydratedAdventure } from '../services/iHydrateAdventureService';
import { Connection } from '../entities';

export interface IGetAdventureTemplatedPromptUseCase {
    execute (params: GetAdventureTemplatedPromptUseCaseParams): Promise<GetAdventureTemplatedPromptUseCaseResponse>;
}

export type GetAdventureTemplatedPromptUseCaseParams =
    | { adventureId: string; }
    | GetAdventureTemplatedPromptFromHydratedParams;

export type GetAdventureTemplatedPromptFromHydratedParams = {
    hydrated: HydratedAdventure;
};

export const HYDRATED_PARAM_KEY = 'hydrated' satisfies keyof GetAdventureTemplatedPromptFromHydratedParams;

export type GetAdventureTemplatedPromptUseCaseResponse = {
    success: boolean;
    prompt?: string;
    error?: string;
};

export type ResolveHydratedReturn = {
    success: boolean;
    hydrated?: HydratedAdventure;
    error?: string;
};

export type WorldMasterRuntimeReturn = {
    success: boolean;
    connection?: Connection;
    modelId?: string;
    error?: string;
};
