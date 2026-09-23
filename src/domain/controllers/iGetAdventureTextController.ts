import { Adventure } from '@domain/entities';
import type { HydratedAdventure } from '@domain/use-cases';

export interface IGetAdventureTextController {
    handle (params: GetAdventureTextControllerParams): Promise<GetAdventureTextControllerResponse>;
}

export type GetAdventureTextControllerParams = {
    adventure: Adventure;
    hydrated?: HydratedAdventure;
};

export type GetAdventureTextControllerResponse = {
    success: boolean;
    prompt?: string;
    error?: string;
};
