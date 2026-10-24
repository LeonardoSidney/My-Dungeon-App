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

    it.each([null, 'draft', 42])('rejects %p because it is not a record', (data) => {
        expect(DraftDTO.fromStorage(data)).toBeNull();
    });

    it.each([
        ['id', 1],
        ['content', 42],
        ['createdAt', 'not a date'],
        ['updatedAt', undefined]
    ])('rejects a stored draft with an invalid %s', (field, value) => {
        expect(DraftDTO.fromStorage({ ...STORED, [field]: value })).toBeNull();
    });
});
