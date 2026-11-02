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

    it('rejects null because it is not a record', () => {
        expect(ModelTemplateDTO.fromStorage(null)).toBeNull();
    });

    it('rejects "template" because it is not a record', () => {
        expect(ModelTemplateDTO.fromStorage('template')).toBeNull();
    });

    it('rejects 42 because it is not a record', () => {
        expect(ModelTemplateDTO.fromStorage(42)).toBeNull();
    });

    it('rejects a stored model template with an invalid id', () => {
        expect(ModelTemplateDTO.fromStorage({ ...STORED, id: 1 })).toBeNull();
    });

    it('rejects a stored model template with an invalid modelId', () => {
        expect(ModelTemplateDTO.fromStorage({ ...STORED, modelId: undefined })).toBeNull();
    });

    it('rejects a stored model template with an invalid connection', () => {
        expect(ModelTemplateDTO.fromStorage({ ...STORED, connection: null })).toBeNull();
    });

    it('rejects a stored model template with an invalid template', () => {
        expect(ModelTemplateDTO.fromStorage({ ...STORED, template: 42 })).toBeNull();
    });

    it('rejects a stored model template with an invalid hash', () => {
        expect(ModelTemplateDTO.fromStorage({ ...STORED, hash: 123 })).toBeNull();
    });

    it('rejects a stored model template with an invalid editedByUser', () => {
        expect(ModelTemplateDTO.fromStorage({ ...STORED, editedByUser: 'false' })).toBeNull();
    });

    it('rejects a stored model template with an invalid createdAt', () => {
        expect(ModelTemplateDTO.fromStorage({ ...STORED, createdAt: 'not a date' })).toBeNull();
    });

    it('rejects a stored model template with an invalid updatedAt', () => {
        expect(ModelTemplateDTO.fromStorage({ ...STORED, updatedAt: undefined })).toBeNull();
    });
});
