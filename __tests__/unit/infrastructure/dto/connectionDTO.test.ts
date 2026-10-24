import { ConnectionDTO } from '@infra/dto';

const createdAt = new Date('2026-01-01T00:00:00.000Z');
const updatedAt = new Date('2026-01-02T00:00:00.000Z');

const STORED = {
    id: 'connection-1',
    name: 'Local',
    ip: 'localhost',
    port: 8080,
    auth: 'Bearer token',
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
};

describe('ConnectionDTO', () => {
    it('converts a stored connection into an entity with parsed dates', () => {
        expect(ConnectionDTO.fromStorage(STORED)?.toEntity()).toEqual({ ...STORED, createdAt, updatedAt });
    });

    it('accepts a connection without port nor auth', () => {
        const entity = ConnectionDTO.fromStorage({ ...STORED, port: undefined, auth: undefined })?.toEntity();

        expect(entity).toEqual({ ...STORED, port: undefined, auth: undefined, createdAt, updatedAt });
    });

    it.each([null, 'connection', 42])('rejects %p because it is not a record', (data) => {
        expect(ConnectionDTO.fromStorage(data)).toBeNull();
    });

    it.each([
        ['id', 1],
        ['name', undefined],
        ['ip', null],
        ['port', '8080'],
        ['auth', 42],
        ['createdAt', 'not a date'],
        ['updatedAt', undefined]
    ])('rejects a stored connection with an invalid %s', (field, value) => {
        expect(ConnectionDTO.fromStorage({ ...STORED, [field]: value })).toBeNull();
    });
});
