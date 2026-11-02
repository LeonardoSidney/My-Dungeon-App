export const STORAGE_NAMESPACE = '@my_dungeon_app';
export const CONNECTION_STORAGE_NAMESPACE = 'connection';
export const SAMPLER_STORAGE_NAMESPACE = 'sampler';
export const ASSISTANT_STORAGE_NAMESPACE = 'assistant';
export const ABILITY_STORAGE_NAMESPACE = 'ability';
export const STATUS_STORAGE_NAMESPACE = 'status';
export const PROFICIENCY_STORAGE_NAMESPACE = 'proficiency';
export const CHARACTER_STORAGE_NAMESPACE = 'character';
export const WORLD_MASTER_STORAGE_NAMESPACE = 'world_master';
export const WORLD_STORAGE_NAMESPACE = 'world';
export const LOCATION_STORAGE_NAMESPACE = 'location';
export const ITEM_STORAGE_NAMESPACE = 'item';
export const SYSTEM_PROMPT_STORAGE_NAMESPACE = 'system_prompt';
export const ADVENTURE_STORAGE_NAMESPACE = 'adventure';
export const ADVENTURE_INDEX_STORAGE_NAMESPACE = 'adventures';
export const ADVENTURE_REJECTED_BACKUP_STORAGE_NAMESPACE = 'adventure_rejected_backup';
export const MODEL_TEMPLATE_STORAGE_NAMESPACE = 'model_template';
export const DRAFT_STORAGE_NAMESPACE = 'draft';
export const SETTINGS_STORAGE_NAMESPACE = 'settings';
export const UNKNOWN_COLLECTION = 'unknown collection';
export const COLLECTION_LABELS: Record<string, string> = {
    [ADVENTURE_STORAGE_NAMESPACE]: 'Adventures',
    [CONNECTION_STORAGE_NAMESPACE]: 'Connections',
    [SAMPLER_STORAGE_NAMESPACE]: 'Samplers',
    [ASSISTANT_STORAGE_NAMESPACE]: 'Assistants',
    [ABILITY_STORAGE_NAMESPACE]: 'Abilities',
    [STATUS_STORAGE_NAMESPACE]: 'Statuses',
    [PROFICIENCY_STORAGE_NAMESPACE]: 'Proficiencies',
    [CHARACTER_STORAGE_NAMESPACE]: 'Characters',
    [WORLD_MASTER_STORAGE_NAMESPACE]: 'World Masters',
    [WORLD_STORAGE_NAMESPACE]: 'Worlds',
    [LOCATION_STORAGE_NAMESPACE]: 'Locations',
    [ITEM_STORAGE_NAMESPACE]: 'Items',
    [SYSTEM_PROMPT_STORAGE_NAMESPACE]: 'System Prompts',
};
export const MIN_PORT = 1;
export const MAX_PORT = 65535;
