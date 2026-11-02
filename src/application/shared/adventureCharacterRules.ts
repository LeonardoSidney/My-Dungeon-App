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
    const hasDedicatedWorldMaster = Boolean(fields.worldMasterId);
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
