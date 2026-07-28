import { Adventure, Character, Chat, Item, Location, SystemPrompt, World, WorldMaster } from '@domain/entities';
import { CharacterDTO } from './characterDTO';
import { ChatDTO } from './chatDTO';
import { ItemDTO } from './itemDTO';
import { LocationDTO } from './locationDTO';
import { isArrayRecord, isRecord, parseDate } from './shared';
import { SystemPromptDTO } from './systemPromptDTO';
import { WorldDTO } from './worldDTO';
import { WorldMasterDTO } from './worldMasterDTO';

export class AdventureDTO {
    constructor (
        private readonly id: string,
        private readonly name: string,
        private readonly chat: Chat[],
        private readonly systemPrompts: SystemPrompt[],
        private readonly characters: Character[],
        private readonly worldMaster: WorldMaster | undefined,
        private readonly worlds: World[] | undefined,
        private readonly locations: Location[] | undefined,
        private readonly items: Item[] | undefined,
        private readonly createdAt: Date,
        private readonly updatedAt: Date
    ) { }

    getId (): string {
        return this.id;
    }

    toEntity (): Adventure {
        return {
            id: this.id,
            name: this.name,
            chat: this.chat,
            systemPrompts: this.systemPrompts,
            characters: this.characters,
            worldMaster: this.worldMaster,
            worlds: this.worlds,
            locations: this.locations,
            items: this.items,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromEntity (adventure: Adventure): AdventureDTO {
        return new AdventureDTO(
            adventure.id,
            adventure.name,
            adventure.chat,
            adventure.systemPrompts,
            adventure.characters,
            adventure.worldMaster,
            adventure.worlds,
            adventure.locations,
            adventure.items,
            adventure.createdAt,
            adventure.updatedAt
        );
    }

    static fromStorage (data: unknown): AdventureDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const createdAt = parseDate(data.createdAt);
        const updatedAt = parseDate(data.updatedAt);
        const chat = this.toChat(data.chat);
        const systemPrompts = this.toSystemPrompts(data.systemPrompts);
        const characters = this.toCharacters(data.characters);
        const worldMaster = this.toWorldMaster(data.worldMaster);
        const worlds = this.toWorlds(data.worlds);
        const locations = this.toLocations(data.locations);
        const items = this.toItems(data.items);

        if (
            typeof data.id !== 'string' ||
            typeof data.name !== 'string' ||
            !chat ||
            !systemPrompts ||
            !characters ||
            !createdAt ||
            !updatedAt
        ) {
            return null;
        }

        return new AdventureDTO(
            data.id,
            data.name,
            chat,
            systemPrompts,
            characters,
            worldMaster,
            worlds,
            locations,
            items,
            createdAt,
            updatedAt
        );
    }

    private static toChat (chats: unknown | undefined): Chat[] | undefined {
        if (!isArrayRecord(chats)) {
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

    private static toSystemPrompts (systemPrompts: unknown | undefined): SystemPrompt[] | undefined {
        if (!isArrayRecord(systemPrompts)) {
            return undefined;
        }

        const systemPromptsDTO = systemPrompts.map((systemPrompt: unknown) => SystemPromptDTO.fromStorage(systemPrompt));
        const validSystemPrompts: SystemPrompt[] = [];

        for (const systemPrompt of systemPromptsDTO) {
            if (systemPrompt !== null) {
                validSystemPrompts.push(systemPrompt.toEntity());
            }
        }

        return validSystemPrompts;
    }

    private static toCharacters (characters: unknown | undefined): Character[] | undefined {
        if (!isArrayRecord(characters)) {
            return undefined;
        }

        const charactersDTO = characters.map((character: unknown) => CharacterDTO.fromStorage(character));
        const validCharacters: Character[] = [];

        for (const character of charactersDTO) {
            if (character !== null) {
                validCharacters.push(character.toEntity());
            }
        }

        return validCharacters;
    }

    private static toWorldMaster (worldMaster: unknown | undefined): WorldMaster | undefined {
        if (!isRecord(worldMaster)) {
            return undefined;
        }

        const worldMasterDTO = WorldMasterDTO.fromStorage(worldMaster);
        return worldMasterDTO?.toEntity();
    }

    private static toWorlds (worlds: unknown | undefined): World[] | undefined {
        if (!isArrayRecord(worlds)) {
            return undefined;
        }

        const worldsDTO = worlds.map((world: unknown) => WorldDTO.fromStorage(world));
        const validWorlds: World[] = [];

        for (const world of worldsDTO) {
            if (world !== null) {
                validWorlds.push(world.toEntity());
            }
        }

        return validWorlds;
    }

    private static toLocations (locations: unknown | undefined): Location[] | undefined {
        if (!isArrayRecord(locations)) {
            return undefined;
        }

        const locationsDTO = locations.map((location: unknown) => LocationDTO.fromStorage(location));
        const validLocations: Location[] = [];

        for (const location of locationsDTO) {
            if (location !== null) {
                validLocations.push(location.toEntity());
            }
        }

        return validLocations;
    }

    private static toItems (items: unknown | undefined): Item[] | undefined {
        if (!isArrayRecord(items)) {
            return undefined;
        }

        const itemsDTO = items.map((item: unknown) => ItemDTO.fromStorage(item));
        const validItems: Item[] = [];

        for (const item of itemsDTO) {
            if (item !== null) {
                validItems.push(item.toEntity());
            }
        }

        return validItems;
    }
}
