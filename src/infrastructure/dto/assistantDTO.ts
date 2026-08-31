import { Assistant } from '@domain/entities';
import { isRecord, parseDate } from './shared';

export class AssistantDTO {
    constructor (
        private readonly id: string,
        private readonly name: string,
        private readonly observation: string | undefined,
        private readonly modelId: string,
        private readonly samplerId: string,
        private readonly connectionId: string,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity (): Assistant {
        return {
            id: this.id,
            name: this.name,
            observation: this.observation,
            modelId: this.modelId,
            samplerId: this.samplerId,
            connectionId: this.connectionId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromStorage (data: unknown): AssistantDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            (data.observation !== undefined && typeof data.observation !== 'string') ||
            typeof data.modelId !== 'string' ||
            typeof data.samplerId !== 'string' ||
            typeof data.connectionId !== 'string' ||
            createdAt === null ||
            updatedAt === null
        ) {
            return null;
        }

        return new AssistantDTO(
            data.id,
            data.name,
            data.observation,
            data.modelId,
            data.samplerId,
            data.connectionId,
            createdAt,
            updatedAt
        );
    }
}
