import { Connection } from '@domain/entities';

export function createConnectionHelper (overrides?: Partial<Connection>): Connection {
    return {
        id: '1',
        name: 'Test Connection',
        ip: 'localhost',
        port: 8080,
        auth: 'Bearer token',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}
