import { AbilityDTO } from '@infra/dto';

const createdAt = new Date('2026-01-01T00:00:00.000Z');
const updatedAt = new Date('2026-01-02T00:00:00.000Z');

const STORED = {
    id: 'a1',
    name: 'Fireball',
    activationWord: 'fire',
    prompt: 'Throws a fireball',
    observation: 'Costs mana',
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
};

describe('AbilityDTO', () => {
    it('converts a stored ability into an entity with parsed dates', () => {
        expect(AbilityDTO.fromStorage(STORED)?.toEntity()).toEqual({ ...STORED, createdAt, updatedAt });
    });

    it('accepts an ability without observation', () => {
        expect(AbilityDTO.fromStorage({ ...STORED, observation: undefined })?.toEntity().observation).toBeUndefined();
    });

    it.each([null, 'ability', 42])('rejects %p because it is not a record', (data) => {
        expect(AbilityDTO.fromStorage(data)).toBeNull();
    });

    it.each([
        ['id', 1],
        ['name', undefined],
        ['activationWord', false],
        ['prompt', null],
        ['observation', 3],
        ['createdAt', 'not a date'],
        ['updatedAt', undefined]
    ])('rejects a stored ability with an invalid %s', (field, value) => {
        expect(AbilityDTO.fromStorage({ ...STORED, [field]: value })).toBeNull();
    });
});
