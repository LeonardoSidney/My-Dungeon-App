import { ModelDTO } from '@infra/dto';

const STORED = {
    id: 'model-a',
    name: 'Model A',
    connectionId: 'connection-1',
    nCtx: 4096,
    ownedBy: 'llamacpp'
};

describe('ModelDTO', () => {
    it('converts a stored model into an entity', () => {
        expect(ModelDTO.fromStorage(STORED)?.toEntity()).toEqual(STORED);
    });

    it('rejects null because it is not a record', () => {
        expect(ModelDTO.fromStorage(null)).toBeNull();
    });

    it('rejects "model" because it is not a record', () => {
        expect(ModelDTO.fromStorage('model')).toBeNull();
    });

    it('rejects 42 because it is not a record', () => {
        expect(ModelDTO.fromStorage(42)).toBeNull();
    });

    it('rejects a stored model with an invalid id', () => {
        expect(ModelDTO.fromStorage({ ...STORED, id: 1 })).toBeNull();
    });

    it('rejects a stored model with an invalid name', () => {
        expect(ModelDTO.fromStorage({ ...STORED, name: undefined })).toBeNull();
    });

    it('rejects a stored model with an invalid connectionId', () => {
        expect(ModelDTO.fromStorage({ ...STORED, connectionId: null })).toBeNull();
    });

    it('rejects a stored model with an invalid ownedBy', () => {
        expect(ModelDTO.fromStorage({ ...STORED, ownedBy: 42 })).toBeNull();
    });

    it('rejects a stored model with an invalid nCtx', () => {
        expect(ModelDTO.fromStorage({ ...STORED, nCtx: '4096' })).toBeNull();
    });
});
