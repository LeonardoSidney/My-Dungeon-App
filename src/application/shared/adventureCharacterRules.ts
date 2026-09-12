import {
    MINIMUM_NUMBER_SYSTEM_PROMPT,
    MINIMUM_PLAYABLE_CHARACTERS,
    MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM,
} from '@domain/constants/adventure';

export type AdventureCharacterFields = {
    characterIds: string[];
    worldMasterId?: string;
    characterAsWorldMasterId?: string;
    charactersControlledByAi: string[];
};

export type AdventureCharacterSummary = {
    playableCharacterIds: string[];
    aiControlledCharacterIds: string[];
    characterAsWorldMasterId?: string;
    hasDedicatedWorldMaster: boolean;
    playableCharacterCount: number;
    nonAiCharacterCount: number;
};

export function buildAdventureCharacterIds (selection: {
    playableCharacterIds: string[];
    characterAsWorldMasterId?: string;
    charactersControlledByAi: string[];
}): string[] {
    const ids = new Set<string>(selection.playableCharacterIds);
    for (const id of selection.charactersControlledByAi) {
        ids.add(id);
    }
    if (selection.characterAsWorldMasterId) {
        ids.add(selection.characterAsWorldMasterId);
    }
    return [...ids];
}

export function summarizeAdventureCharacters (fields: AdventureCharacterFields): AdventureCharacterSummary {
    const hasDedicatedWorldMaster = fields.worldMasterId !== undefined;
    const characterAsWorldMasterId = hasDedicatedWorldMaster ? undefined : fields.characterAsWorldMasterId;

    const aiControlledSet = new Set(fields.charactersControlledByAi);
    const aiControlledCharacterIds = fields.charactersControlledByAi.filter(id => fields.characterIds.includes(id));

    const playableCharacterIds = fields.characterIds.filter(id => {
        const isAiControlled = aiControlledSet.has(id);
        const isWorldMasterCharacter = characterAsWorldMasterId !== undefined && id === characterAsWorldMasterId;
        return !isAiControlled && !isWorldMasterCharacter;
    });

    const nonAiCharacterCount = fields.characterIds.length - aiControlledCharacterIds.length;

    return {
        playableCharacterIds,
        aiControlledCharacterIds,
        characterAsWorldMasterId,
        hasDedicatedWorldMaster,
        playableCharacterCount: playableCharacterIds.length,
        nonAiCharacterCount,
    };
}

export function validateAdventureCharacterSelection (
    fields: AdventureCharacterFields,
    systemPromptCount: number
): string | null {
    const { characterIds, worldMasterId, characterAsWorldMasterId, charactersControlledByAi } = fields;

    if (systemPromptCount < MINIMUM_NUMBER_SYSTEM_PROMPT) {
        return 'A system prompt is required';
    }

    if (worldMasterId && characterAsWorldMasterId) {
        return 'An adventure cannot have both a world master and a character acting as world master';
    }

    if (characterAsWorldMasterId && !characterIds.includes(characterAsWorldMasterId)) {
        return 'The character acting as world master must be part of the adventure';
    }

    const orphanedAiCharacter = charactersControlledByAi.find(id => !characterIds.includes(id));
    if (orphanedAiCharacter) {
        return 'Every AI controlled character must be part of the adventure';
    }

    if (characterAsWorldMasterId && charactersControlledByAi.includes(characterAsWorldMasterId)) {
        return 'The character acting as world master cannot be AI controlled';
    }

    const summary = summarizeAdventureCharacters(fields);

    if (summary.playableCharacterCount < MINIMUM_PLAYABLE_CHARACTERS) {
        return `You need at least ${MINIMUM_PLAYABLE_CHARACTERS} playable character`;
    }

    if (!worldMasterId) {
        if (!characterAsWorldMasterId) {
            return 'An adventure without a world master needs a character acting as world master';
        }
        if (summary.nonAiCharacterCount < MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM) {
            return `You need at least ${MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM} characters in an adventure without a world master`;
        }
    }

    return null;
}
