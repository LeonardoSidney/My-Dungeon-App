import { Assistant, WorldMaster } from '@domain/entities';
import { AssistantDTO } from './assistantDTO';
import { isRecord, parseDate } from './shared';

export class WorldMasterDTO {
    constructor(
        private readonly id: string,
        private readonly name: string,
        private readonly activationWord: string,
        private readonly prompt: string,
        private readonly observation: string | undefined,
        private readonly assistant: Assistant,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity(): WorldMaster {
        return {
            id: this.id,
            name: this.name,
            activationWord: this.activationWord,
            prompt: this.prompt,
            observation: this.observation,
            assistant: this.assistant,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromStorage(data: unknown): WorldMasterDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);
        const assistant = this.toAssistant(data.assistant);

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            typeof data.activationWord !== 'string' ||
            typeof data.prompt !== 'string' ||
            (data.observation !== undefined && typeof data.observation !== 'string') ||
            assistant === undefined ||
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
            assistant,
            createdAt,
            updatedAt
        );
    }

    private static toAssistant(assistant: unknown | undefined): Assistant | undefined {
        if (!isRecord(assistant)) {
            return undefined;
        }

        const assistantDTO = AssistantDTO.fromStorage(assistant);
        return assistantDTO?.toEntity();
    }
}
