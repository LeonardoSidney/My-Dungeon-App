import { Attribute, MirostatEnum } from '../entities';

export type ListControllerResponse<T> = {
    success: boolean;
    items?: T[];
    error?: string;
};

export type DetailControllerResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

export type MutationControllerResponse = {
    success: boolean;
    id?: string;
    error?: string;
};

export type GetByIdControllerParams = {
    id: string;
};

export type EntityOption = {
    id: string;
    name: string;
};

export type ActivationPromptListItem = EntityOption & {
    activationWord: string;
};

export type ActivationPromptDetails = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type WorldMasterDetails = ActivationPromptDetails & {
    assistantId: string;
};

export type CharacterDetails = ActivationPromptDetails & {
    assistantId: string;
    abilityIds: string[];
    proficiencyIds: string[];
    statusIds: string[];
    attributes: Attribute[];
};

export type AssistantDetails = {
    id: string;
    name: string;
    observation?: string;
    modelId: string;
    samplerId: string;
    connectionId: string;
};

export type SystemPromptListItem = EntityOption & {
    content: string;
};

export type SystemPromptDetails = {
    id: string;
    name: string;
    content: string;
    observation?: string;
};

export type ConnectionListItem = EntityOption & {
    ip: string;
    port?: number;
};

export type ConnectionDetails = {
    id: string;
    name: string;
    ip: string;
    port?: number;
    auth?: string;
};

export type SamplerDetails = {
    id: string;
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

export type SamplerListItem = SamplerDetails & {
    systemDefault: boolean;
};

export type ModelOption = EntityOption & {
    connectionId: string;
    connectionName: string;
};

export type AdventureListItem = EntityOption & {
    createdAt: string;
};

export type AdventureDetails = {
    id: string;
    name: string;
    systemPromptIds: string[];
    playableCharacterIds: string[];
    aiControlledCharacterIds: string[];
    characterAsWorldMasterId?: string;
    worldMasterId?: string;
    worldIds: string[];
    locationIds: string[];
    itemIds: string[];
};
