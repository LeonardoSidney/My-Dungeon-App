import { Chat, RoleEnum } from '../entities';
import type { HydratedAdventure } from './iHydrateAdventureService';

export interface ITurnSpeakerService {
    resolveNextSpeaker (hydrated: HydratedAdventure): ResolveTurnSpeakerReturn;
    resolveChatSpeaker (hydrated: HydratedAdventure, chat: Chat): ResolveTurnSpeakerReturn;
    resolveWorldMaster (hydrated: HydratedAdventure): ResolveTurnSpeakerReturn;
}

export enum TurnSpeakerKindEnum {
    AI_CHARACTER = 'aiCharacter',
    WORLD_MASTER = 'worldMaster',
}

export type TurnSpeakerKind = TurnSpeakerKindEnum.AI_CHARACTER | TurnSpeakerKindEnum.WORLD_MASTER;

export type TurnSpeakerRole = RoleEnum.AI_PERSONA | RoleEnum.ASSISTANT;

export type TurnSpeaker = {
    kind: TurnSpeakerKind;
    role: TurnSpeakerRole;
    characterId: string;
    name: string;
    assistantId: string;
};

export type ResolveTurnSpeakerReturn = {
    success: boolean;
    speaker?: TurnSpeaker;
    error?: string;
};

export type TurnProgress = {
    spokenPlayerIds: Set<string>;
    spokenAiCharacterIds: Set<string>;
};

export type SpeakerRuntime = {
    connectionId: string;
    samplerId: string;
    modelId: string;
    characterId: string;
};
