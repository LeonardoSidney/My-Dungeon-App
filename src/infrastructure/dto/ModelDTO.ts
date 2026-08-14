import { Connection, Model } from '@domain/entities';
import { ConnectionDTO } from './connectionDTO';
import { isRecord } from './shared';

export class ModelDTO {
    constructor (
        readonly id: string,
        readonly name: string,
        readonly connection: Connection,
        readonly nCtx: number,
        readonly ownedBy: string
    ) { }

    static fromStorage (data: unknown): ModelDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const connection = this.toConnection(data.connection);

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            !connection ||
            typeof data.ownedBy !== 'string' ||
            typeof data.nCtx !== 'number'
        ) {
            return null;
        }

        return new ModelDTO(
            data.id,
            data.name,
            connection,
            data.nCtx,
            data.ownedBy
        );
    }

    toEntity (): Model {
        return {
            id: this.id,
            name: this.name,
            connection: this.connection,
            nCtx: this.nCtx,
            ownedBy: this.ownedBy
        };
    }

    private static toConnection (connecition: unknown | undefined): Connection | undefined {
        if (!isRecord(connecition)) {
            return undefined;
        }

        const connectionDTO = ConnectionDTO.fromStorage(connecition);
        return connectionDTO?.toEntity();
    }
}
