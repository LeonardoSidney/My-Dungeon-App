import type { HydratedAdventure } from '../services/iHydrateAdventureService';

export type { HydratedAdventure, HydratedCharacter } from '../services/iHydrateAdventureService';

export interface IHydrateAdventureUseCase {
    execute (params: HydrateAdventureParams): Promise<HydrateAdventureReturn>;
}

export type HydrateAdventureParams = {
    adventureId: string;
};

export type HydrateAdventureReturn = {
    success: boolean;
    hydrated?: HydratedAdventure;
    error?: string;
};

