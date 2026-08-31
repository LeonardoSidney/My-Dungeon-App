import { Adventure } from '@domain/entities';
import { HydratedAdventure } from '@domain/use-cases';

export interface IHydrateAdventureController {
    handle (request: HydrateAdventureControllerRequest): Promise<HydrateAdventureControllerResponse>;
}

export type HydrateAdventureControllerRequest = {
    adventure: Adventure;
};

export type HydrateAdventureControllerResponse = {
    success: boolean;
    hydrated?: HydratedAdventure;
    error?: string;
};
