import { Attribute, MirostatEnum } from '@domain/entities';
import {
    CreateAbilityControllerParams,
    CreateConnectionConfigControllerRequest,
    CreateItemRequest,
    CreateLocationRequest,
    CreateProficiencyControllerParams,
    CreateStatusControllerParams,
    CreateSystemPromptRequest,
    CreateWorldRequest,
    CreateWorldMasterControllerParams,
} from '@domain/controllers';

export type SeedConnection = CreateConnectionConfigControllerRequest;

export type SeedSampler = {
    name: string;
    observation?: string;
    adaptativeDecay?: number;
    adaptativeTarget?: number;
    dryAllowedLenght?: number;
    dryBase?: number;
    dryMultiplier?: number;
    drySequenceBreakers?: string;
    dynaTempExp?: number;
    dynaTempRange?: number;
    ignoreEOS?: boolean;
    minP?: number;
    mirostat?: MirostatEnum;
    mirostatEnt?: number;
    mirostatLr?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    repeatLastN?: number;
    repeatPenalty?: number;
    seed?: string;
    temperature?: number;
    topK?: number;
    topNSigma?: number;
    topP?: number;
    typicalP?: number;
    xtcProbability?: number;
    xtcThreshould?: number;
};

export type SeedAssistant = {
    name: string;
    observation?: string;
    modelId: string;
    sampler: string;
};

export type SeedAbility = CreateAbilityControllerParams;

export type SeedStatus = CreateStatusControllerParams;

export type SeedProficiency = CreateProficiencyControllerParams;

export type SeedCharacter = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistant: string;
    abilities?: string[];
    proficiencies?: string[];
    statuses?: string[];
    attributes?: Attribute[];
};

export type SeedWorldMaster = Omit<CreateWorldMasterControllerParams, 'assistantId'> & {
    assistant: string;
};

export type SeedSystemPrompt = CreateSystemPromptRequest;

export type SeedWorld = CreateWorldRequest;

export type SeedLocation = CreateLocationRequest;

export type SeedItem = CreateItemRequest;

export type SeedAdventure = {
    name: string;
    characters: string[];
    worldMaster?: string;
    systemPrompts: string[];
    worlds: string[];
    locations: string[];
    items: string[];
    charactersControlledByAi: string[];
};
