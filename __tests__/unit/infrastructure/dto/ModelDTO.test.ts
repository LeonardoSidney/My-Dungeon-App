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

    it.each([null, 'model', 42])('rejects %p because it is not a record', (data) => {
        expect(ModelDTO.fromStorage(data)).toBeNull();
    });

    it.each([
        ['id', 1],
        ['name', undefined],
        ['connectionId', null],
        ['ownedBy', 42],
        ['nCtx', '4096']
    ])('rejects a stored model with an invalid %s', (field, value) => {
        expect(ModelDTO.fromStorage({ ...STORED, [field]: value })).toBeNull();
    });
});
