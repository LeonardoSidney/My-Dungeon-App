import { Character } from '../entities';

export interface IGetCharacterByIdUseCase {
    execute (params: GetCharacterByIdUseCaseParams): Promise<GetCharacterByIdUseCaseReturn>;
}

export type GetCharacterByIdUseCaseParams = {
    id: string;
};

export type GetCharacterByIdUseCaseReturn = {
    success: boolean;
    character?: Character;
    error?: string;
};
