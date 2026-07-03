import { Think } from '@domain/entities';
import { isRecord } from './shared';

export class ThinkDTO {
    constructor(
        private readonly id: string,
        private readonly content: string | undefined,
        private readonly enabled: boolean
    ) { }

    toEntity(): Think {
        return {
            id: this.id,
            content: this.content,
            enabled: this.enabled
        };
    }

    static fromStorage(data: unknown): ThinkDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        if (
            typeof data.id !== 'string' ||
            (data.content !== undefined && typeof data.content !== 'string') ||
            typeof data.enabled !== 'boolean'
        ) {
            return null;
        }

        return new ThinkDTO(
            data.id,
            data.content,
            data.enabled
        );
    }
}
