import { Character } from '../entities';

export interface IGetCharactersUseCase {
    execute (): Promise<GetCharactersUseCaseReturn>;
}

export type GetCharactersUseCaseReturn = {
    success: boolean;
    characters?: Character[];
    error?: string;
};
