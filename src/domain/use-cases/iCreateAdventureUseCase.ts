import { Adventure, Character, Item, Location, SystemPrompt, World, WorldMaster } from '../entities';

export interface ICreateAdventureUseCase {
    execute(request: CreateAdventureCaseParams): Promise<CreateAdventureCaseReturn>;
}

export type CreateAdventureCaseParams = {
    name: string;
    systemPrompts: SystemPrompt[];
    characters: Character[];
    worldMaster?: WorldMaster;
    locations?: Location[];
    worlds?: World[];
    items?: Item[];
};

export type CreateAdventureCaseReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
