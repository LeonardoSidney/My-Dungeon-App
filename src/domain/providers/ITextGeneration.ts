import { HydratedAdventure } from '@domain/use-cases';

export interface ITextGeneration {
    buildAdventureTextSystemPrompt (hydrated: HydratedAdventure, loadOrder: string): BuildAdventureTextSystemPromptReturn;
}

export type BuildAdventureTextSystemPromptReturn = {
    success: boolean;
    systemPrompt?: string;
    error?: string;
};

export type AdventureTemplates = {
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

export type LoadOrderSections = Map<string, string>;

export type EnabledCharacterReferences = {
    abilities: boolean;
    proficiencies: boolean;
    statuses: boolean;
};

export type ResolveTemplatesReturn = {
    success: boolean;
    templates?: AdventureTemplates;
    error?: string;
};
