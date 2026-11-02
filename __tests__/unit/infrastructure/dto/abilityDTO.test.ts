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

    it('rejects null because it is not a record', () => {
        expect(AbilityDTO.fromStorage(null)).toBeNull();
    });

    it('rejects "ability" because it is not a record', () => {
        expect(AbilityDTO.fromStorage('ability')).toBeNull();
    });

    it('rejects 42 because it is not a record', () => {
        expect(AbilityDTO.fromStorage(42)).toBeNull();
    });

    it('rejects a stored ability with an invalid id', () => {
        expect(AbilityDTO.fromStorage({ ...STORED, id: 1 })).toBeNull();
    });

    it('rejects a stored ability with an invalid name', () => {
        expect(AbilityDTO.fromStorage({ ...STORED, name: undefined })).toBeNull();
    });

    it('rejects a stored ability with an invalid activationWord', () => {
        expect(AbilityDTO.fromStorage({ ...STORED, activationWord: false })).toBeNull();
    });

    it('rejects a stored ability with an invalid prompt', () => {
        expect(AbilityDTO.fromStorage({ ...STORED, prompt: null })).toBeNull();
    });

    it('rejects a stored ability with an invalid observation', () => {
        expect(AbilityDTO.fromStorage({ ...STORED, observation: 3 })).toBeNull();
    });

    it('rejects a stored ability with an invalid createdAt', () => {
        expect(AbilityDTO.fromStorage({ ...STORED, createdAt: 'not a date' })).toBeNull();
    });

    it('rejects a stored ability with an invalid updatedAt', () => {
        expect(AbilityDTO.fromStorage({ ...STORED, updatedAt: undefined })).toBeNull();
    });
});
