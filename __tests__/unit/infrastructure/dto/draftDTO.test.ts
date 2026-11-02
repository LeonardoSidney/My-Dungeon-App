import { DraftDTO } from '@infra/dto';

const createdAt = new Date('2026-01-01T00:00:00.000Z');
const updatedAt = new Date('2026-01-02T00:00:00.000Z');

const STORED = {
    id: 'home',
    content: 'Once upon a time',
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
};

describe('DraftDTO', () => {
    it('converts a stored draft into an entity with parsed dates', () => {
        expect(DraftDTO.fromStorage(STORED)?.toEntity()).toEqual({ ...STORED, createdAt, updatedAt });
    });

    it('accepts an empty draft', () => {
        expect(DraftDTO.fromStorage({ ...STORED, content: '' })?.toEntity().content).toBe('');
    });

    it('rejects null because it is not a record', () => {
        expect(DraftDTO.fromStorage(null)).toBeNull();
    });

    it('rejects "draft" because it is not a record', () => {
        expect(DraftDTO.fromStorage('draft')).toBeNull();
    });

    it('rejects 42 because it is not a record', () => {
        expect(DraftDTO.fromStorage(42)).toBeNull();
    });

    it('rejects a stored draft with an invalid id', () => {
        expect(DraftDTO.fromStorage({ ...STORED, id: 1 })).toBeNull();
    });

    it('rejects a stored draft with an invalid content', () => {
        expect(DraftDTO.fromStorage({ ...STORED, content: 42 })).toBeNull();
    });

    it('rejects a stored draft with an invalid createdAt', () => {
        expect(DraftDTO.fromStorage({ ...STORED, createdAt: 'not a date' })).toBeNull();
    });

    it('rejects a stored draft with an invalid updatedAt', () => {
        expect(DraftDTO.fromStorage({ ...STORED, updatedAt: undefined })).toBeNull();
    });
});
