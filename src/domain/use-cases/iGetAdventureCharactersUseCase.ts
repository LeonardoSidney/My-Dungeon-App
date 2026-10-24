import { Character } from '../entities';

export interface IGetAdventureCharactersUseCase {
    execute (params: GetAdventureCharactersUseCaseParams): Promise<GetAdventureCharactersUseCaseReturn>;
}

export type GetAdventureCharactersUseCaseParams = {
    adventureId: string;
};

export type GetAdventureCharactersUseCaseReturn = {
    success: boolean;
    characters?: Character[];
    error?: string;
};
