export const DEFAULT_TEXT_ADVENTURE_TEMPLATE = `{systemPrompt}
{worldMaster}
{characterAsWorldMaster}
{worlds}
{locations}
{items}
{abilities}
{proficiencies}
{statuses}
{characters}\n`;
export const DEFAULT_TEXT_ADVENTURE_SYSTEM_PROMPT_TEMPLATE = '# SYSTEM PROMPT\n{systemPrompt}';
export const DEFAULT_TEXT_ADVENTURE_WORLD_MASTER_TEMPLATE = '# WORLD MASTER\n{worldMaster}';
export const DEFAULT_TEXT_ADVENTURE_IA_CONTROLLED_CHARACTER_TEMPLATE = `# IA-CONTROLLED CHARACTER
You will act as the following character. Respond and act on behalf of this character in the adventure.
{characterAsWorldMaster}\n`;
export const DEFAULT_TEXT_ADVENTURE_WORLDS_TEMPLATE = '# WORLDS\n{worlds}';
export const DEFAULT_TEXT_ADVENTURE_LOCATIONS_TEMPLATE = '# LOCATIONS\n{locations}';
export const DEFAULT_TEXT_ADVENTURE_ITEMS_TEMPLATE = '# ITEMS\n{items}';
export const DEFAULT_TEXT_ADVENTURE_ABILITIES_TEMPLATE = '# ABILITIES\n{abilities}';
export const DEFAULT_TEXT_ADVENTURE_PROFICIENCIES_TEMPLATE = '# PROFICIENCIES\n{proficiencies}';
export const DEFAULT_TEXT_ADVENTURE_STATUSES_TEMPLATE = '# STATUSES\n{statuses}';
export const DEFAULT_TEXT_ADVENTURE_CHARACTERS_TEMPLATE = '# CHARACTERS\n{characters}';
