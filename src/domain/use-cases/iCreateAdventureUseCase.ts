import type { AdventureFormFields } from '../services';

export interface ICreateAdventureUseCase {
    execute (request: CreateAdventureCaseParams): Promise<CreateAdventureCaseReturn>;
}

export type CreateAdventureCaseParams = AdventureFormFields;

export type CreateAdventureCaseReturn = {
    success: boolean;
    id?: string;
    error?: string;
};
