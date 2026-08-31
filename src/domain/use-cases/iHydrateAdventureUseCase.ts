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

/**
 * Character resolvido para o contexto de uma aventura concreta.
 *
 * O `Character` persistido guarda apenas IDs (`abilityIds`, `proficiencyIds`,
 * `statusIds`, `assistantId`) e já não carrega as flags por aventura
 * (`worldMaster`/`aiControlled`) — essas vivem no `Adventure`. Aqui as
 * referências são resolvidas e as flags são re-acionadas para que o
 * consumo em runtime (prompt de sistema, seletor, chat) enxergue a mesma
 * forma que tinha antes da denormalização.
 */
export type HydratedCharacter = Character & {
    abilities: Ability[];
    proficiencies: Proficiency[];
    statuses: Status[];
    worldMaster: boolean;
    aiControlled: boolean;
};

/**
 * View-model de uma aventura com todos os IDs resolvidos em entidades
 * persistidas. `Model` não é incluído de propósito: ele não é persistido
 * (vem do provider) e o runtime precisa apenas de `connection` + `modelId`.
 */
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

export interface IHydrateAdventureUseCase {
    execute (params: HydrateAdventureParams): Promise<HydrateAdventureReturn>;
}

export type HydrateAdventureParams = {
    adventure: Adventure;
};

export type HydrateAdventureReturn = {
    success: boolean;
    hydrated?: HydratedAdventure;
    error?: string;
};
