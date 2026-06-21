import { Connection } from "../../domain/entities";

export class ConnectionDTO {
    public readonly id: string;
    public readonly name: string;
    public readonly ip: string;
    public readonly port?: number;
    public readonly auth?: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    constructor(connection: Connection) {
        this.id = connection.id;
        this.name = connection.name;
        this.ip = connection.ip;
        this.port = connection.port;
        this.auth = connection.auth;
        this.createdAt = connection.createdAt;
        this.updatedAt = connection.updatedAt;
    }

    public toEntity(): Connection {
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

    public toDb() {
        return {
            id: this.id,
            name: this.name,
            ip: this.ip,
            port: this.port,
            auth: this.auth,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        };
    }
}
