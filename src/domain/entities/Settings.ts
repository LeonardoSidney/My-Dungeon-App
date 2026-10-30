export enum ChatTemplateKeyEnum {
    SYSTEM_PROMPT = 'systemPrompt',
    WORLD_MASTER = 'worldMaster',
    IA_CONTROLLED_CHARACTER = 'iaControlledCharacter',
    WORLDS = 'worlds',
    LOCATIONS = 'locations',
    ITEMS = 'items',
    ABILITIES = 'abilities',
    PROFICIENCIES = 'proficiencies',
    STATUSES = 'statuses',
    CHARACTERS = 'characters',
    MESSAGE = 'message',
    CONTEXT_MESSAGE = 'contextMessage',
    TURN_MESSAGE = 'turnMessage',
    CHARACTER_MESSAGE = 'characterMessage',
    INSTRUCTIONS_MESSAGE = 'instructionsMessage',
    AI_CHARACTER_INSTRUCTION = 'aiCharacterInstruction',
    WORLD_MASTER_INSTRUCTION = 'worldMasterInstruction',
    CONTEXT_INSTRUCTION = 'contextInstruction',
}

export type ChatTemplateKey =
    | ChatTemplateKeyEnum.SYSTEM_PROMPT
    | ChatTemplateKeyEnum.WORLD_MASTER
    | ChatTemplateKeyEnum.IA_CONTROLLED_CHARACTER
    | ChatTemplateKeyEnum.WORLDS
    | ChatTemplateKeyEnum.LOCATIONS
    | ChatTemplateKeyEnum.ITEMS
    | ChatTemplateKeyEnum.ABILITIES
    | ChatTemplateKeyEnum.PROFICIENCIES
    | ChatTemplateKeyEnum.STATUSES
    | ChatTemplateKeyEnum.CHARACTERS
    | ChatTemplateKeyEnum.MESSAGE
    | ChatTemplateKeyEnum.CONTEXT_MESSAGE
    | ChatTemplateKeyEnum.TURN_MESSAGE
    | ChatTemplateKeyEnum.CHARACTER_MESSAGE
    | ChatTemplateKeyEnum.INSTRUCTIONS_MESSAGE
    | ChatTemplateKeyEnum.AI_CHARACTER_INSTRUCTION
    | ChatTemplateKeyEnum.WORLD_MASTER_INSTRUCTION
    | ChatTemplateKeyEnum.CONTEXT_INSTRUCTION;

export type ChatTemplates = Record<ChatTemplateKey, string>;

export type ChatTemplateOverrides = Partial<ChatTemplates>;

export type ChatTemplateFieldErrors = Partial<ChatTemplates>;

export type ChatTemplateDefinition = {
    defaultTemplate: string;
    requiredTags: string[];
    optionalTags: string[];
};

export type ChatTemplateDefinitions = Record<ChatTemplateKey, ChatTemplateDefinition>;

export type Settings = {
    systemPromptLoadOrder?: string;
    showThinkBlocks?: boolean;
    chatTemplates?: ChatTemplateOverrides;
};
