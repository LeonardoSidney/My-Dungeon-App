import { ModelTemplateDTO } from '@infra/dto';

const createdAt = new Date('2026-01-01T00:00:00.000Z');
const updatedAt = new Date('2026-01-02T00:00:00.000Z');

const STORED = {
    id: 'template-1',
    modelId: 'model-a',
    connection: 'localhost:8080',
    template: 'jinja {{ messages }}',
    hash: 'hash-of-template',
    editedByUser: false,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
};

describe('ModelTemplateDTO', () => {
    it('converts a stored model template into an entity with parsed dates', () => {
        expect(ModelTemplateDTO.fromStorage(STORED)?.toEntity()).toEqual({ ...STORED, createdAt, updatedAt });
    });

    it('accepts a model template without hash', () => {
        expect(ModelTemplateDTO.fromStorage({ ...STORED, hash: undefined })?.toEntity().hash).toBeUndefined();
    });

    it.each([null, 'template', 42])('rejects %p because it is not a record', (data) => {
        expect(ModelTemplateDTO.fromStorage(data)).toBeNull();
    });

    it.each([
        ['id', 1],
        ['modelId', undefined],
        ['connection', null],
        ['template', 42],
        ['hash', 123],
        ['editedByUser', 'false'],
        ['createdAt', 'not a date'],
        ['updatedAt', undefined]
    ])('rejects a stored model template with an invalid %s', (field, value) => {
        expect(ModelTemplateDTO.fromStorage({ ...STORED, [field]: value })).toBeNull();
    });
});
