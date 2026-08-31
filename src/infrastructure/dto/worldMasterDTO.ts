import { WorldMaster } from '@domain/entities';
import { isRecord, parseDate } from './shared';

export class WorldMasterDTO {
    constructor (
        private readonly id: string,
        private readonly name: string,
        private readonly activationWord: string,
        private readonly prompt: string,
        private readonly observation: string | undefined,
        private readonly assistantId: string,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity (): WorldMaster {
        return {
            id: this.id,
            name: this.name,
            activationWord: this.activationWord,
            prompt: this.prompt,
            observation: this.observation,
            assistantId: this.assistantId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromStorage (data: unknown): WorldMasterDTO | null {
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
            typeof data.assistantId !== 'string' ||
            createdAt === null ||
            updatedAt === null
        ) {
            return null;
        }

        return new WorldMasterDTO(
            data.id,
            data.name,
            data.activationWord,
            data.prompt,
            data.observation,
            data.assistantId,
            createdAt,
            updatedAt
        );
    }
}
