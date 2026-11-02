import { AdventureIndexEntry } from '@domain/entities';
import { isRecord, parseDate } from './shared';

export class AdventureIndexEntryDTO {
    constructor (
        private readonly id: string,
        private readonly name: string,
        private readonly hasStreamingChat: boolean,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity (): AdventureIndexEntry {
        return {
            id: this.id,
            name: this.name,
            hasStreamingChat: this.hasStreamingChat,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromStorage (data: unknown): AdventureIndexEntryDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            typeof data.hasStreamingChat !== 'boolean' ||
            createdAt === null ||
            updatedAt === null
        ) {
            return null;
        }

        return new AdventureIndexEntryDTO(data.id, data.name, data.hasStreamingChat, createdAt, updatedAt);
    }
}
