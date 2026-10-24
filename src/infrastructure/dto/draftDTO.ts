import { Draft } from '@domain/entities';
import { isRecord, parseDate } from './shared';

export class DraftDTO {
    constructor (
        private readonly id: string,
        private readonly content: string,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity (): Draft {
        return {
            id: this.id,
            content: this.content,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromStorage (data: unknown): DraftDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);

        if (
            typeof data.id !== 'string' ||
            typeof data.content !== 'string' ||
            !createdAt ||
            !updatedAt
        ) {
            return null;
        }

        return new DraftDTO(data.id, data.content, createdAt, updatedAt);
    }
}
