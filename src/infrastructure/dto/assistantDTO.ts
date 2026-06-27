import { Assistant } from "../../domain/entities";
import { isRecord, parseDate } from "./shared";

export class AssistantDTO {
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly observation: string | undefined,
        private readonly model: Assistant["model"],
        private readonly sampler: Assistant["sampler"],
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity(): Assistant {
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

    static fromStorage(data: unknown): AssistantDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);

        if (
            typeof data.id !== "string" ||
            typeof data.name !== "string" ||
            (data.observation !== undefined && typeof data.observation !== "string") ||
            !isRecord(data.model) ||
            !isRecord(data.sampler) ||
            !createdAt ||
            !updatedAt
        ) {
            return null;
        }

        return new AssistantDTO(
            data.id,
            data.name,
            data.observation,
            data.model as Assistant["model"],
            data.sampler as Assistant["sampler"],
            createdAt,
            updatedAt
        );
    }
}
