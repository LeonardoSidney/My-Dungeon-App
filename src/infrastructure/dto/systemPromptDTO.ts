import { SystemPrompt } from '@domain/entities';
import { isRecord, parseDate } from './shared';

export class SystemPromptDTO {
    constructor (
        private readonly id: string,
        private readonly name: string,
        private readonly content: string,
        private readonly observation: string | undefined,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity (): SystemPrompt {
        return {
            id: this.id,
            name: this.name,
            content: this.content,
            observation: this.observation,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromStorage (data: unknown): SystemPromptDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            typeof data.content !== 'string' ||
            (data.observation !== undefined && typeof data.observation !== 'string') ||
            createdAt === null ||
            updatedAt === null
        ) {
            return null;
        }

        return new SystemPromptDTO(
            data.id,
            data.name,
            data.content,
            data.observation,
            createdAt,
            updatedAt
        );
    }
}
