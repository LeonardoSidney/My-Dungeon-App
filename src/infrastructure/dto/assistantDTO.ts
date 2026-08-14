import { Assistant, Model, Sampler } from '@domain/entities';
import { ModelDTO } from './ModelDTO';
import { SamplerDTO } from './samplerDTO';
import { isRecord, parseDate } from './shared';

export class AssistantDTO {
    constructor (
        private readonly id: string,
        private readonly name: string,
        private readonly observation: string | undefined,
        private readonly model: Model,
        private readonly sampler: Sampler,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity (): Assistant {
        return {
            id: this.id,
            name: this.name,
            observation: this.observation,
            model: this.model,
            sampler: this.sampler,
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
        const model = this.toModel(data.model);
        const sampler = this.toSampler(data.sampler);

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            (data.observation !== undefined && typeof data.observation !== 'string') ||
            !model ||
            !sampler ||
            !createdAt ||
            !updatedAt
        ) {
            return null;
        }

        return new AssistantDTO(
            data.id,
            data.name,
            data.observation,
            model,
            sampler,
            createdAt,
            updatedAt
        );
    }

    private static toModel (models: unknown | undefined): Model | undefined {
        if (!isRecord(models)) {
            return undefined;
        }

        const modelDTO = ModelDTO.fromStorage(models);
        return modelDTO?.toEntity();
    }

    private static toSampler (sampler: unknown | undefined): Sampler | undefined {
        if (!isRecord(sampler)) {
            return undefined;
        }

        const samplerDTO = SamplerDTO.fromStorage(sampler);
        return samplerDTO?.toEntity();
    }
}
