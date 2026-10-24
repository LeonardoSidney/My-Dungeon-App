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

    it.each([null, 'character', 42])('rejects %p because it is not a record', (data) => {
        expect(CharacterDTO.fromStorage(data)).toBeNull();
    });

    it.each([
        ['id', 1],
        ['name', undefined],
        ['activationWord', false],
        ['prompt', null],
        ['observation', 3],
        ['assistantId', 42],
        ['createdAt', 'not a date'],
        ['updatedAt', undefined]
    ])('rejects a stored character with an invalid %s', (field, value) => {
        expect(CharacterDTO.fromStorage({ ...STORED, [field]: value })).toBeNull();
    });
});
