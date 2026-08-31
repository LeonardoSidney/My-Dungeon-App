import { Adventure, Chat } from '@domain/entities';
import { ChatDTO } from './chatDTO';
import { isRecord, isStringArray, parseDate } from './shared';

export class AdventureDTO {
    constructor (
        private readonly id: string,
        private readonly name: string,
        private readonly chat: Chat[],
        private readonly characterIds: string[],
        private readonly worldMasterId: string | undefined,
        private readonly characterAsWorldMasterId: string | undefined,
        private readonly charactersControlledByAi: string[],
        private readonly systemPromptIds: string[],
        private readonly worldIds: string[],
        private readonly locationIds: string[],
        private readonly itemIds: string[],
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    toEntity (): Adventure {
        return {
            id: this.id,
            name: this.name,
            chat: this.chat,
            characterIds: this.characterIds,
            worldMasterId: this.worldMasterId,
            characterAsWorldMasterId: this.characterAsWorldMasterId,
            charactersControlledByAi: this.charactersControlledByAi,
            systemPromptIds: this.systemPromptIds,
            worldIds: this.worldIds,
            locationIds: this.locationIds,
            itemIds: this.itemIds,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromStorage (data: unknown): AdventureDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);
        const chat = this.toChat(data.chat);
        const characterIds = this.toStringArray(data.characterIds);
        const worldMasterId = this.toOptionalString(data.worldMasterId);
        const characterAsWorldMasterId = this.toOptionalString(data.characterAsWorldMasterId);
        const charactersControlledByAi = this.toStringArray(data.charactersControlledByAi);
        const systemPromptIds = this.toStringArray(data.systemPromptIds);
        const worldIds = this.toStringArray(data.worldIds);
        const locationIds = this.toStringArray(data.locationIds);
        const itemIds = this.toStringArray(data.itemIds);

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            !chat ||
            !characterIds ||
            !charactersControlledByAi ||
            !systemPromptIds ||
            !worldIds ||
            !locationIds ||
            !itemIds ||
            createdAt === null ||
            updatedAt === null
        ) {
            return null;
        }

        return new AdventureDTO(
            data.id,
            data.name,
            chat,
            characterIds,
            worldMasterId,
            characterAsWorldMasterId,
            charactersControlledByAi,
            systemPromptIds,
            worldIds,
            locationIds,
            itemIds,
            createdAt,
            updatedAt
        );
    }

    private static toChat (chats: unknown | undefined): Chat[] | undefined {
        if (!Array.isArray(chats)) {
            return undefined;
        }

        const chatsDTO = chats.map((chat: unknown) => ChatDTO.fromStorage(chat));
        const validChats: Chat[] = [];

        for (const chat of chatsDTO) {
            if (chat !== null) {
                validChats.push(chat.toEntity());
            }
        }

        return validChats;
    }

    private static toStringArray (ids: unknown | undefined): string[] | undefined {
        if (!isStringArray(ids)) {
            return undefined;
        }

        return ids;
    }

    private static toOptionalString (value: unknown | undefined): string | undefined {
        if (value === undefined) {
            return undefined;
        }

        if (typeof value !== 'string') {
            return undefined;
        }

        return value;
    }
}
