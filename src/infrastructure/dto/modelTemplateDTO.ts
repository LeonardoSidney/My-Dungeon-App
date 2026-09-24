import { ModelTemplate } from '@domain/entities';
import { isRecord, parseDate } from './shared';

export class ModelTemplateDTO {
    constructor (
        private readonly id: string,
        private readonly modelId: string,
        private readonly connection: string,
        private readonly template: string,
        private readonly hash: string | undefined,
        private readonly editedByUser: boolean,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity (): ModelTemplate {
        return {
            id: this.id,
            modelId: this.modelId,
            connection: this.connection,
            template: this.template,
            hash: this.hash,
            editedByUser: this.editedByUser,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromStorage (data: unknown): ModelTemplateDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);

        if (
            typeof data.id !== 'string' ||
            typeof data.modelId !== 'string' ||
            typeof data.connection !== 'string' ||
            typeof data.template !== 'string' ||
            (data.hash !== undefined && typeof data.hash !== 'string') ||
            typeof data.editedByUser !== 'boolean' ||
            !createdAt ||
            !updatedAt
        ) {
            return null;
        }

        return new ModelTemplateDTO(
            data.id,
            data.modelId,
            data.connection,
            data.template,
            data.hash,
            data.editedByUser,
            createdAt,
            updatedAt
        );
    }
}
