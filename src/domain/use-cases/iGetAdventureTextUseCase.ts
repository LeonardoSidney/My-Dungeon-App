import { Adventure } from '@domain/entities';
import type { HydratedAdventure } from '../services/iHydrateAdventureService';

export interface IGetAdventureTextUseCase {
    execute (params: GetAdventureTextUseCaseParams): Promise<GetAdventureTextUseCaseResponse>;
}

export type GetAdventureTextUseCaseParams = {
    adventure: Adventure;
    hydrated?: HydratedAdventure;
};

export type GetAdventureTextUseCaseResponse = {
    success: boolean;
    prompt?: string;
    error?: string;
};
