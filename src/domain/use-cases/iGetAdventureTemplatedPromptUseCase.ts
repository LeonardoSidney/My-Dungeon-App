import type { HydratedAdventure } from '../services/iHydrateAdventureService';
import type { TurnSpeaker } from '../services/iTurnSpeakerService';
import type { TurnPromptPurpose } from '../providers/ITextGeneration';
import { Connection } from '../entities';

export interface IGetAdventureTemplatedPromptUseCase {
    execute (params: GetAdventureTemplatedPromptUseCaseParams): Promise<GetAdventureTemplatedPromptUseCaseResponse>;
}

export type GetAdventureTemplatedPromptUseCaseParams =
    | { adventureId: string; }
    | GetAdventureTemplatedPromptFromHydratedParams;

export type GetAdventureTemplatedPromptFromHydratedParams = {
    hydrated: HydratedAdventure;
    speaker: TurnSpeaker;
    purpose: TurnPromptPurpose;
    context?: string;
    targetChatId?: string;
};

export const HYDRATED_PARAM_KEY = 'hydrated' satisfies keyof GetAdventureTemplatedPromptFromHydratedParams;

export type GetAdventureTemplatedPromptUseCaseResponse = {
    success: boolean;
    prompt?: string;
    error?: string;
};

export type ResolveTemplatedPromptRequestReturn = {
    success: boolean;
    request?: GetAdventureTemplatedPromptFromHydratedParams;
    error?: string;
};

export type SpeakerConnectionReturn = {
    success: boolean;
    connection?: Connection;
    modelId?: string;
    error?: string;
};
