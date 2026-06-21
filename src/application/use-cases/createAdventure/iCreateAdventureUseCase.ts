import { Adventure, Character, Item, Location, SystemPrompt, World, WorldMaster } from "../../../domain/entities";

export interface ICreateAdventureUseCase {
    execute(request: CreateAdventureCaseParams): CreateAdventureCaseReturn;
}

export type CreateAdventureCaseParams = {
    name: string;
    systemPrompt: SystemPrompt[];
    characters: Character[];
    worldMaster?: WorldMaster;
    location?: Location;
    world?: World;
    items?: Item[];
};

export type CreateAdventureCaseReturn = {
    adventure: Adventure;
};
