import { Character } from '../entities';

export interface ICharacterRepository {
    saveCharacter (params: SaveCharacterParams): Promise<SaveCharacterRepositoryReturn>;
    getCharacters (): Promise<GetCharactersRepositoryReturn>;
    getCharacterById (characterId: string): Promise<GetCharacterByIdRepositoryReturn>;
    editCharacter (params: EditCharacterParams): Promise<EditCharacterReturn>;
    eraseCharacter (characterId: string): Promise<EraseCharacterReturn>;
}

export type SaveCharacterParams = {
    character: Character;
};

export type EditCharacterParams = {
    character: Character;
};

export type SaveCharacterRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetCharactersRepositoryReturn = {
    success: boolean;
    characters?: Character[];
    error?: string;
};

export type GetCharacterByIdRepositoryReturn = {
    success: boolean;
    character?: Character;
    error?: string;
};

export type EditCharacterReturn = {
    success: boolean;
    error?: string;
};

export type EraseCharacterReturn = {
    success: boolean;
    error?: string;
};
