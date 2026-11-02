import {
    buildAdventureCharacterIds,
    summarizeAdventureCharacters,
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

        it('should not treat a blank worldMasterId as a dedicated world master', () => {
            const summary = summarizeAdventureCharacters({
                characterIds: ['wmChar', 'playable'],
                worldMasterId: '',
                characterAsWorldMasterId: 'wmChar',
                charactersControlledByAi: [],
            });

            expect(summary.hasDedicatedWorldMaster).toBe(false);
            expect(summary.characterAsWorldMasterId).toBe('wmChar');
            expect(summary.playableCharacterIds).toEqual(['playable']);
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

        it('should count the world master character toward the non AI characters but not the playable ones', () => {
            const summary = summarizeAdventureCharacters({
                characterIds: ['wmChar', 'playable'],
                worldMasterId: undefined,
                characterAsWorldMasterId: 'wmChar',
                charactersControlledByAi: [],
            });

            expect(summary.nonAiCharacterCount).toBe(2);
            expect(summary.playableCharacterCount).toBe(1);
        });
    });
});
