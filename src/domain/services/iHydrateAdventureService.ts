import {
    Ability,
    Adventure,
    Assistant,
    Character,
    Connection,
    Item,
    Location,
    Proficiency,
    Sampler,
    Status,
    SystemPrompt,
    World,
    WorldMaster,
} from '../entities';

export type HydratedCharacter = Character & {
    abilities: Ability[];
    proficiencies: Proficiency[];
    statuses: Status[];
    worldMaster: boolean;
    aiControlled: boolean;
};

export type HydratedAdventure = {
    adventure: Adventure;
    characters: HydratedCharacter[];
    worldMaster: WorldMaster | undefined;
    assistants: Record<string, Assistant>;
    samplers: Sampler[];
    connections: Connection[];
    worlds: World[];
    locations: Location[];
    items: Item[];
    systemPrompts: SystemPrompt[];
    abilities: Ability[];
    proficiencies: Proficiency[];
    statuses: Status[];
};

export interface IHydrateAdventureService {
    hydrate (params: HydrateAdventureServiceParams): Promise<HydrateAdventureServiceResponse>;
}

export type HydrateAdventureServiceParams = {
    adventure: Adventure;
};

export type HydrateAdventureServiceResponse = {
    success: boolean;
    hydrated?: HydratedAdventure;
    error?: string;
};
