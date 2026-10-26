import {
    assignCharacterRole,
    CharacterRoleEnum,
    getCharacterRole,
    selectWorldMaster,
} from '@presentation/screens/adventures/form/adventureRoster';

const aria = { id: 'char-1', name: 'Aria' };
const bram = { id: 'char-2', name: 'Bram' };
const luna = { id: 'wm-1', name: 'Luna' };

const roster = {
    characters: [aria],
    charactersControlledByAi: ['char-2'],
    characterAsWorldMasterId: undefined,
    worldMaster: luna,
};

describe('getCharacterRole', () => {
    it('tells the role of each character', () => {
        expect(getCharacterRole(roster, 'char-1')).toBe(CharacterRoleEnum.PLAYER);
        expect(getCharacterRole(roster, 'char-2')).toBe(CharacterRoleEnum.AI);
        expect(getCharacterRole(roster, 'char-3')).toBe(CharacterRoleEnum.OFF);
        expect(getCharacterRole({ ...roster, characterAsWorldMasterId: 'char-3' }, 'char-3')).toBe(CharacterRoleEnum.NARRATOR);
    });
});

describe('assignCharacterRole', () => {
    it('moves a character from the AI to the player', () => {
        const change = assignCharacterRole(roster, bram, CharacterRoleEnum.PLAYER);

        expect(change.characters).toEqual([aria, bram]);
        expect(change.charactersControlledByAi).toEqual([]);
    });

    it('leaves a character out of every role', () => {
        const change = assignCharacterRole(roster, aria, CharacterRoleEnum.OFF);

        expect(change.characters).toEqual([]);
        expect(change.charactersControlledByAi).toEqual(['char-2']);
    });

    it('makes a character narrate and drops the world master', () => {
        const change = assignCharacterRole(roster, bram, CharacterRoleEnum.NARRATOR);

        expect(change.characterAsWorldMasterId).toBe('char-2');
        expect(change.charactersControlledByAi).toEqual([]);
        expect(change.worldMaster).toBeUndefined();
    });

    it('changes nothing when the character already has the role', () => {
        expect(assignCharacterRole(roster, aria, CharacterRoleEnum.PLAYER)).toEqual({});
    });
});

describe('selectWorldMaster', () => {
    it('keeps the current world master when it is picked again', () => {
        expect(selectWorldMaster(roster, luna)).toEqual({});
    });

    it('replaces a narrating character with the picked world master', () => {
        const change = selectWorldMaster({ ...roster, worldMaster: undefined, characterAsWorldMasterId: 'char-3' }, luna);

        expect(change).toMatchObject({ worldMaster: luna, characterAsWorldMasterId: undefined });
    });
});
