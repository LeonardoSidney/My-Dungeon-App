export enum MissingReferenceOwnerEnum {
    ADVENTURE = 'adventure',
    CHARACTER = 'character',
    WORLD_MASTER = 'worldMaster',
    ASSISTANT = 'assistant',
}

export type MissingReferenceOwner =
    | MissingReferenceOwnerEnum.ADVENTURE
    | MissingReferenceOwnerEnum.CHARACTER
    | MissingReferenceOwnerEnum.WORLD_MASTER
    | MissingReferenceOwnerEnum.ASSISTANT;

export enum MissingReferenceKindEnum {
    ABILITY = 'ability',
    ASSISTANT = 'assistant',
    CHARACTER = 'character',
    CONNECTION = 'connection',
    ITEM = 'item',
    LOCATION = 'location',
    PROFICIENCY = 'proficiency',
    SAMPLER = 'sampler',
    STATUS = 'status',
    SYSTEM_PROMPT = 'systemPrompt',
    WORLD = 'world',
    WORLD_MASTER = 'worldMaster',
}

export type MissingReferenceKind =
    | MissingReferenceKindEnum.ABILITY
    | MissingReferenceKindEnum.ASSISTANT
    | MissingReferenceKindEnum.CHARACTER
    | MissingReferenceKindEnum.CONNECTION
    | MissingReferenceKindEnum.ITEM
    | MissingReferenceKindEnum.LOCATION
    | MissingReferenceKindEnum.PROFICIENCY
    | MissingReferenceKindEnum.SAMPLER
    | MissingReferenceKindEnum.STATUS
    | MissingReferenceKindEnum.SYSTEM_PROMPT
    | MissingReferenceKindEnum.WORLD
    | MissingReferenceKindEnum.WORLD_MASTER;

export type MissingReference = {
    owner: MissingReferenceOwner;
    ownerName: string;
    kind: MissingReferenceKind;
    id: string;
};
