import { Character } from '../entities';

export interface IEditCharacterService {
    editCharacter (params: EditCharacterServiceParams): EditCharacterServiceReturn;
}

export type CharacterEditParams = Omit<Character, 'id' | 'createdAt' | 'updatedAt'>;

export type EditCharacterServiceParams = {
    character: Character;
    editParams: CharacterEditParams;
};

export type EditCharacterServiceReturn = {
    success: boolean;
    character?: Character;
    error?: string;
};
