export const DEFAULT_TEXT_ADVENTURE_TEMPLATE =
    '{systemPrompt}{worldMaster}{characterAsWorldMaster}{worlds}{locations}{items}{abilities}{proficiencies}{statuses}{characters}';
export const DEFAULT_TEXT_ADVENTURE_SYSTEM_PROMPT_TEMPLATE = '# SYSTEM PROMPT\n{systemPrompt}\n';
export const DEFAULT_TEXT_ADVENTURE_WORLD_MASTER_TEMPLATE = '# WORLD MASTER\n{worldMaster}\n';
export const DEFAULT_TEXT_ADVENTURE_IA_CONTROLLED_CHARACTER_TEMPLATE = `# IA-CONTROLLED CHARACTER
You will act as the following character. Respond and act on behalf of this character in the adventure.
{characterAsWorldMaster}\n`;
export const DEFAULT_TEXT_ADVENTURE_WORLDS_TEMPLATE = '# WORLDS\n{worlds}\n';
export const DEFAULT_TEXT_ADVENTURE_LOCATIONS_TEMPLATE = '# LOCATIONS\n{locations}\n';
export const DEFAULT_TEXT_ADVENTURE_ITEMS_TEMPLATE = '# ITEMS\n{items}\n';
export const DEFAULT_TEXT_ADVENTURE_ABILITIES_TEMPLATE = '# ABILITIES\n{abilities}\n';
export const DEFAULT_TEXT_ADVENTURE_PROFICIENCIES_TEMPLATE = '# PROFICIENCIES\n{proficiencies}\n';
export const DEFAULT_TEXT_ADVENTURE_STATUSES_TEMPLATE = '# STATUSES\n{statuses}\n';
export const DEFAULT_TEXT_ADVENTURE_CHARACTERS_TEMPLATE = '# CHARACTERS\n{characters}';
