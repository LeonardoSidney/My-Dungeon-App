import { HydratedAdventure } from '@domain/use-cases';

export interface ITextGeneration {
    buildAdventureTextSystemPrompt (hydrated: HydratedAdventure): BuildAdventureTextSystemPromptReturn;
}

export type BuildAdventureTextSystemPromptReturn = {
    success: boolean;
    systemPrompt?: string;
    error?: string;
};

export type AdventureTemplates = {
    root: string;
    systemPrompt: string;
    worldMaster: string;
    iaControlledCharacter: string;
    worlds: string;
    locations: string;
    items: string;
    abilities: string;
    proficiencies: string;
    statuses: string;
    characters: string;
};

export type ResolveTemplatesReturn = {
    success: boolean;
    templates?: AdventureTemplates;
    error?: string;
};
