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
export const DEFAULT_MESSAGE_TEMPLATE = '{context}{turnMessage}{instructionMessage}';
export const DEFAULT_CONTEXT_MESSAGE_TEMPLATE = '<context>\n{chatbotResume}</context>\n';
export const DEFAULT_TURN_MESSAGE_TEMPLATE = '<turn_chat_content>\n{charactersMessages}</turn_chat_content>\n';
export const DEFAULT_CHARACTER_MESSAGE_TEMPLATE = '<message character="{characterName}">{characterMessage}</message>\n';
export const DEFAULT_INSTRUCTIONS_MESSAGE_TEMPLATE = '<instruction>{instructionMessage}</instruction>';
export const DEFAULT_AI_CHARACTER_INSTRUCTION_TEMPLATE =
    'Respond and act only as {characterName}. Do not write lines or actions for any other character.';
export const DEFAULT_WORLD_MASTER_INSTRUCTION_TEMPLATE =
    'You are {characterName}, the world master and your own character in this adventure. Resolve this turn: describe the outcome of everyone\'s actions above and hand the scene back to the players. Respond and act only as {characterName}. Do not write lines or actions for any other character.';
export const DEFAULT_CONTEXT_INSTRUCTION_TEMPLATE =
    'Write the context of the current scene to guide {characterName}\'s next reply: where the characters are, what just happened and what is at stake for {characterName}. Do not write lines or actions for any character. Reply only with the context.';
