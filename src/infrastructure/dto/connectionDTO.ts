import { Connection } from '@domain/entities';
import { isRecord, parseDate } from './shared';

export class ConnectionDTO {
    public readonly id: string;
    public readonly name: string;
    public readonly ip: string;
    public readonly port?: number;
    public readonly auth?: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    constructor (connection: Connection) {
        this.id = connection.id;
        this.name = connection.name;
        this.ip = connection.ip;
        this.port = connection.port;
        this.auth = connection.auth;
        this.createdAt = connection.createdAt;
        this.updatedAt = connection.updatedAt;
    }

    public toEntity (): Connection {
        return {
            id: this.id,
            name: this.name,
            ip: this.ip,
            port: this.port,
            auth: this.auth,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromStorage (data: unknown): ConnectionDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            typeof data.ip !== 'string' ||
            (data.port !== undefined && typeof data.port !== 'number') ||
            (data.auth !== undefined && typeof data.auth !== 'string') ||
            !createdAt ||
            !updatedAt
        ) {
            return null;
        }

        return new ConnectionDTO({
            id: data.id,
            name: data.name,
            ip: data.ip,
            port: data.port,
            auth: data.auth,
            createdAt: createdAt,
            updatedAt: updatedAt
        });
    }
}
