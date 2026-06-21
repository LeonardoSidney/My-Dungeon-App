import { Adventure, Character, Item, Location, SystemPrompt, World, WorldMaster } from "../../../domain/entities";

export interface ICreateAdventureController {
    handle(request: CreateAdventureRequest): CreateAdventureResponse;
}

export type CreateAdventureRequest = {
    name: string;
    systemPrompt: SystemPrompt[];
    characters: Character[];
    worldMaster?: WorldMaster;
    location?: Location;
    world?: World;
    items?: Item[];
};

export type CreateAdventureResponse = {
    adventure: Adventure;
};
