import { Character } from '../entities';

export interface ICharacterRepository {
    saveCharacter (params: SaveCharacterParams): Promise<boolean>;
    getCharacters (): Promise<Character[]>;
    editCharacter (params: EditCharacterParams): Promise<EditCharacterReturn>;
    eraseCharacter (characterId: string): Promise<EraseCharacterReturn>;
}

export type SaveCharacterParams = {
    character: Character;
};

export type EditCharacterParams = {
    character: Character;
};

export type EditCharacterReturn = {
    success: boolean;
    error?: string;
};

export type EraseCharacterReturn = {
    success: boolean;
    error?: string;
};
