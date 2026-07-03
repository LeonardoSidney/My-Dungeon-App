import { Location } from '@domain/entities';
import { isRecord, parseDate } from './shared';

export class LocationDTO {
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly activationWord: string,
        private readonly prompt: string,
        private readonly observation: string | undefined,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity(): Location {
        return {
            id: this.id,
            name: this.name,
            activationWord: this.activationWord,
            prompt: this.prompt,
            observation: this.observation,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromStorage(data: unknown): LocationDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            typeof data.activationWord !== 'string' ||
            typeof data.prompt !== 'string' ||
            (data.observation !== undefined && typeof data.observation !== 'string') ||
            createdAt === null ||
            updatedAt === null
        ) {
            return null;
        }

        return new LocationDTO(
            data.id,
            data.name,
            data.activationWord,
            data.prompt,
            data.observation,
            createdAt,
            updatedAt
        );
    }
}
