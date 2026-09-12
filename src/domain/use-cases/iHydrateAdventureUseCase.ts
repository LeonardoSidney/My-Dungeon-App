import { Adventure } from '../entities';
import type { HydratedAdventure } from '../services/iHydrateAdventureService';

export type { HydratedAdventure, HydratedCharacter } from '../services/iHydrateAdventureService';

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

