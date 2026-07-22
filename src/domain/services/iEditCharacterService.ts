import { Character } from '../entities';

export interface IEditCharacterService {
    editCharacter (params: EditCharacterServiceParams): EditCharacterServiceReturn;
}

export type EditCharacterServiceParams = {
    character: Character;
};

export type EditCharacterServiceReturn = {
    success: boolean;
    character?: Character;
    error?: string;
};
