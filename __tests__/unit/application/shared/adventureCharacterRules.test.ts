import {
    buildAdventureCharacterIds,
    summarizeAdventureCharacters,
    validateAdventureCharacterSelection,
} from '@application/shared/adventureCharacterRules';

describe('adventureCharacterRules', () => {
    describe('buildAdventureCharacterIds', () => {
        it('should union playable, AI controlled and character-as-world-master ids without duplicates', () => {
            const ids = buildAdventureCharacterIds({
                playableCharacterIds: ['a', 'b'],
                characterAsWorldMasterId: 'a',
                charactersControlledByAi: ['c', 'a'],
            });

            expect(new Set(ids).size).toBe(ids.length);
            expect(ids).toEqual(expect.arrayContaining(['a', 'b', 'c']));
            expect(ids).toHaveLength(3);
        });

        it('should return only playable ids when there is no world master character nor AI controlled character', () => {
            const ids = buildAdventureCharacterIds({
                playableCharacterIds: ['a'],
                characterAsWorldMasterId: undefined,
                charactersControlledByAi: [],
            });

            expect(ids).toEqual(['a']);
        });
    });

    describe('summarizeAdventureCharacters', () => {
        it('should classify a character as world master when there is no dedicated world master', () => {
            const summary = summarizeAdventureCharacters({
                characterIds: ['wm', 'playable', 'ai'],
                worldMasterId: undefined,
                characterAsWorldMasterId: 'wm',
                charactersControlledByAi: ['ai'],
            });

            expect(summary.hasDedicatedWorldMaster).toBe(false);
            expect(summary.characterAsWorldMasterId).toBe('wm');
            expect(summary.aiControlledCharacterIds).toEqual(['ai']);
            expect(summary.playableCharacterIds).toEqual(['playable']);
            expect(summary.playableCharacterCount).toBe(1);
        });

        it('should ignore characterAsWorldMasterId when a dedicated world master exists', () => {
            const summary = summarizeAdventureCharacters({
                characterIds: ['wmChar', 'playable'],
                worldMasterId: 'wm-entity',
                characterAsWorldMasterId: 'wmChar',
                charactersControlledByAi: [],
            });

            expect(summary.hasDedicatedWorldMaster).toBe(true);
            expect(summary.characterAsWorldMasterId).toBeUndefined();
            expect(summary.playableCharacterIds).toEqual(['wmChar', 'playable']);
            expect(summary.playableCharacterCount).toBe(2);
        });

        it('should exclude AI controlled characters from the playable count', () => {
            const summary = summarizeAdventureCharacters({
                characterIds: ['playable', 'ai1', 'ai2'],
                worldMasterId: 'wm-entity',
                characterAsWorldMasterId: undefined,
                charactersControlledByAi: ['ai1', 'ai2'],
            });

            expect(summary.playableCharacterIds).toEqual(['playable']);
            expect(summary.playableCharacterCount).toBe(1);
        });
    });

    describe('validateAdventureCharacterSelection', () => {
        it('should require at least one system prompt', () => {
            const error = validateAdventureCharacterSelection({
                characterIds: ['playable', 'wmChar'],
                worldMasterId: 'wm-entity',
                characterAsWorldMasterId: undefined,
                charactersControlledByAi: [],
            }, 0);

            expect(error).toBe('A system prompt is required');
        });

        it('should reject both a dedicated world master and a character acting as world master', () => {
            const error = validateAdventureCharacterSelection({
                characterIds: ['playable', 'wmChar'],
                worldMasterId: 'wm-entity',
                characterAsWorldMasterId: 'wmChar',
                charactersControlledByAi: [],
            }, 1);

            expect(error).toBe('An adventure cannot have both a world master and a character acting as world master');
        });

        it('should reject a character acting as world master that is not part of the adventure', () => {
            const error = validateAdventureCharacterSelection({
                characterIds: ['playable'],
                worldMasterId: undefined,
                characterAsWorldMasterId: 'missing',
                charactersControlledByAi: [],
            }, 1);

            expect(error).toBe('The character acting as world master must be part of the adventure');
        });

        it('should reject an AI controlled character that is not part of the adventure', () => {
            const error = validateAdventureCharacterSelection({
                characterIds: ['playable', 'wmChar'],
                worldMasterId: undefined,
                characterAsWorldMasterId: 'wmChar',
                charactersControlledByAi: ['missing'],
            }, 1);

            expect(error).toBe('Every AI controlled character must be part of the adventure');
        });

        it('should reject a character acting as world master that is also AI controlled', () => {
            const error = validateAdventureCharacterSelection({
                characterIds: ['playable', 'wmChar'],
                worldMasterId: undefined,
                characterAsWorldMasterId: 'wmChar',
                charactersControlledByAi: ['wmChar'],
            }, 1);

            expect(error).toBe('The character acting as world master cannot be AI controlled');
        });

        it('should require at least one playable character', () => {
            const error = validateAdventureCharacterSelection({
                characterIds: ['wmChar'],
                worldMasterId: undefined,
                characterAsWorldMasterId: 'wmChar',
                charactersControlledByAi: [],
            }, 1);

            expect(error).toBe('You need at least 1 playable character');
        });

        it('should reject an adventure without a world master that has no character acting as world master', () => {
            const error = validateAdventureCharacterSelection({
                characterIds: ['playable', 'playable2'],
                worldMasterId: undefined,
                characterAsWorldMasterId: undefined,
                charactersControlledByAi: [],
            }, 1);

            expect(error).toBe('An adventure without a world master needs a character acting as world master');
        });

        it('should accept a no-world-master adventure with a world master character and one playable character', () => {
            const error = validateAdventureCharacterSelection({
                characterIds: ['wmChar', 'playable'],
                worldMasterId: undefined,
                characterAsWorldMasterId: 'wmChar',
                charactersControlledByAi: [],
            }, 1);

            expect(error).toBeNull();
        });

        it('should count the world master character toward the minimum when there is no dedicated world master', () => {
            const summary = summarizeAdventureCharacters({
                characterIds: ['wmChar', 'playable'],
                worldMasterId: undefined,
                characterAsWorldMasterId: 'wmChar',
                charactersControlledByAi: [],
            });

            expect(summary.nonAiCharacterCount).toBe(2);
            expect(summary.playableCharacterCount).toBe(1);
        });

        it('should pass a valid dedicated world master selection with one playable character', () => {
            const error = validateAdventureCharacterSelection({
                characterIds: ['playable'],
                worldMasterId: 'wm-entity',
                characterAsWorldMasterId: undefined,
                charactersControlledByAi: [],
            }, 1);

            expect(error).toBeNull();
        });

        it('should pass a valid no-world-master selection with character acting as world master', () => {
            const error = validateAdventureCharacterSelection({
                characterIds: ['playable1', 'playable2', 'wmChar', 'ai'],
                worldMasterId: undefined,
                characterAsWorldMasterId: 'wmChar',
                charactersControlledByAi: ['ai'],
            }, 1);

            expect(error).toBeNull();
        });
    });
});
