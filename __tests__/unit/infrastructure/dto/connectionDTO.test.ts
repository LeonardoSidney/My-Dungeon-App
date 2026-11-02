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

    it('rejects null because it is not a record', () => {
        expect(ConnectionDTO.fromStorage(null)).toBeNull();
    });

    it('rejects "connection" because it is not a record', () => {
        expect(ConnectionDTO.fromStorage('connection')).toBeNull();
    });

    it('rejects 42 because it is not a record', () => {
        expect(ConnectionDTO.fromStorage(42)).toBeNull();
    });

    it('rejects a stored connection with an invalid id', () => {
        expect(ConnectionDTO.fromStorage({ ...STORED, id: 1 })).toBeNull();
    });

    it('rejects a stored connection with an invalid name', () => {
        expect(ConnectionDTO.fromStorage({ ...STORED, name: undefined })).toBeNull();
    });

    it('rejects a stored connection with an invalid ip', () => {
        expect(ConnectionDTO.fromStorage({ ...STORED, ip: null })).toBeNull();
    });

    it('rejects a stored connection with an invalid port', () => {
        expect(ConnectionDTO.fromStorage({ ...STORED, port: '8080' })).toBeNull();
    });

    it('rejects a stored connection with an invalid auth', () => {
        expect(ConnectionDTO.fromStorage({ ...STORED, auth: 42 })).toBeNull();
    });

    it('rejects a stored connection with an invalid createdAt', () => {
        expect(ConnectionDTO.fromStorage({ ...STORED, createdAt: 'not a date' })).toBeNull();
    });

    it('rejects a stored connection with an invalid updatedAt', () => {
        expect(ConnectionDTO.fromStorage({ ...STORED, updatedAt: undefined })).toBeNull();
    });
});
