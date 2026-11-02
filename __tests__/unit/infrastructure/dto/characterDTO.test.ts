import { CharacterDTO } from '@infra/dto';

const createdAt = new Date('2026-01-01T00:00:00.000Z');
const updatedAt = new Date('2026-01-02T00:00:00.000Z');

const STORED = {
    id: 'hero',
    name: 'Hero',
    activationWord: 'hero',
    prompt: 'A brave hero',
    observation: 'Main character',
    abilityIds: ['ability-1'],
    proficiencyIds: ['proficiency-1'],
    statusIds: ['status-1'],
    attributes: [{ name: 'Strength', value: 10 }],
    assistantId: 'assistant-1',
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
};

describe('CharacterDTO', () => {
    it('converts a stored character into an entity with parsed dates', () => {
        expect(CharacterDTO.fromStorage(STORED)?.toEntity()).toEqual({ ...STORED, createdAt, updatedAt });
    });

    it('accepts a character without observation, trait lists nor attributes', () => {
        const entity = CharacterDTO.fromStorage({
            ...STORED,
            observation: undefined,
            abilityIds: undefined,
            proficiencyIds: undefined,
            statusIds: undefined,
            attributes: undefined
        })?.toEntity();

        expect(entity).toEqual(expect.objectContaining({
            observation: undefined,
            abilityIds: undefined,
            proficiencyIds: undefined,
            statusIds: undefined,
            attributes: undefined
        }));
    });

    it('ignores trait lists that are not lists of strings', () => {
        const entity = CharacterDTO.fromStorage({ ...STORED, abilityIds: [1], proficiencyIds: 'p', statusIds: null })?.toEntity();

        expect(entity?.abilityIds).toBeUndefined();
        expect(entity?.proficiencyIds).toBeUndefined();
        expect(entity?.statusIds).toBeUndefined();
    });

    it('keeps only the attributes with a string name and a number value', () => {
        const entity = CharacterDTO.fromStorage({
            ...STORED,
            attributes: [{ name: 'Strength', value: 10 }, { name: 'Luck', value: '7' }, { name: 3, value: 1 }]
        })?.toEntity();

        expect(entity?.attributes).toEqual([{ name: 'Strength', value: 10 }]);
    });

    it('rejects null because it is not a record', () => {
        expect(CharacterDTO.fromStorage(null)).toBeNull();
    });

    it('rejects "character" because it is not a record', () => {
        expect(CharacterDTO.fromStorage('character')).toBeNull();
    });

    it('rejects 42 because it is not a record', () => {
        expect(CharacterDTO.fromStorage(42)).toBeNull();
    });

    it('rejects a stored character with an invalid id', () => {
        expect(CharacterDTO.fromStorage({ ...STORED, id: 1 })).toBeNull();
    });

    it('rejects a stored character with an invalid name', () => {
        expect(CharacterDTO.fromStorage({ ...STORED, name: undefined })).toBeNull();
    });

    it('rejects a stored character with an invalid activationWord', () => {
        expect(CharacterDTO.fromStorage({ ...STORED, activationWord: false })).toBeNull();
    });

    it('rejects a stored character with an invalid prompt', () => {
        expect(CharacterDTO.fromStorage({ ...STORED, prompt: null })).toBeNull();
    });

    it('rejects a stored character with an invalid observation', () => {
        expect(CharacterDTO.fromStorage({ ...STORED, observation: 3 })).toBeNull();
    });

    it('rejects a stored character with an invalid assistantId', () => {
        expect(CharacterDTO.fromStorage({ ...STORED, assistantId: 42 })).toBeNull();
    });

    it('rejects a stored character with an invalid createdAt', () => {
        expect(CharacterDTO.fromStorage({ ...STORED, createdAt: 'not a date' })).toBeNull();
    });

    it('rejects a stored character with an invalid updatedAt', () => {
        expect(CharacterDTO.fromStorage({ ...STORED, updatedAt: undefined })).toBeNull();
    });
});
