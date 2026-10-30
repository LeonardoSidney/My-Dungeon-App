import { ChatTemplateDefinition, ChatTemplateKey, ChatTemplateKeyEnum } from '@domain/entities';

export type ChatTemplateField = {
  key: ChatTemplateKey;
  label: string;
};

export const TURN_TEMPLATE_FIELDS: ChatTemplateField[] = [
    { key: ChatTemplateKeyEnum.MESSAGE, label: 'Turn message layout' },
    { key: ChatTemplateKeyEnum.CONTEXT_MESSAGE, label: 'Scene context block' },
    { key: ChatTemplateKeyEnum.TURN_MESSAGE, label: 'Turn lines block' },
    { key: ChatTemplateKeyEnum.CHARACTER_MESSAGE, label: 'Character line' },
    { key: ChatTemplateKeyEnum.INSTRUCTIONS_MESSAGE, label: 'Instruction block' },
    { key: ChatTemplateKeyEnum.AI_CHARACTER_INSTRUCTION, label: 'AI character instruction' },
    { key: ChatTemplateKeyEnum.WORLD_MASTER_INSTRUCTION, label: 'World master instruction' },
    { key: ChatTemplateKeyEnum.CONTEXT_INSTRUCTION, label: 'Scene context instruction' },
];

export const SYSTEM_PROMPT_SECTION_FIELDS: ChatTemplateField[] = [
    { key: ChatTemplateKeyEnum.SYSTEM_PROMPT, label: 'System prompts' },
    { key: ChatTemplateKeyEnum.WORLD_MASTER, label: 'World master' },
    { key: ChatTemplateKeyEnum.IA_CONTROLLED_CHARACTER, label: 'Character acting as world master' },
    { key: ChatTemplateKeyEnum.WORLDS, label: 'Worlds' },
    { key: ChatTemplateKeyEnum.LOCATIONS, label: 'Locations' },
    { key: ChatTemplateKeyEnum.ITEMS, label: 'Items' },
    { key: ChatTemplateKeyEnum.ABILITIES, label: 'Abilities' },
    { key: ChatTemplateKeyEnum.PROFICIENCIES, label: 'Proficiencies' },
    { key: ChatTemplateKeyEnum.STATUSES, label: 'Statuses' },
    { key: ChatTemplateKeyEnum.CHARACTERS, label: 'Characters' },
];

export function formatAcceptedTags ({ requiredTags, optionalTags }: ChatTemplateDefinition): string {
    const required = requiredTags.map(tag => `{${tag}}`).join(' ');
    const optional = optionalTags.map(tag => `{${tag}}`).join(' ');

    if (!optional) {
        return `Required: ${required}`;
    }
    if (!required) {
        return `Optional: ${optional}`;
    }
    return `Required: ${required} · Optional: ${optional}`;
}
