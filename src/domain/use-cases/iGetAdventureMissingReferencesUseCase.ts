import { MissingReference } from '../entities';

export interface IGetAdventureMissingReferencesUseCase {
    execute (params: GetAdventureMissingReferencesUseCaseParams): Promise<GetAdventureMissingReferencesUseCaseReturn>;
}

export type GetAdventureMissingReferencesUseCaseParams = {
    adventureId: string;
};

export type GetAdventureMissingReferencesUseCaseReturn = {
    success: boolean;
    missingReferences?: MissingReference[];
    error?: string;
};
