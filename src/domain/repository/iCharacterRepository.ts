import { Character } from '../entities';

export interface ICharacterRepository {
    saveCharacter(params: SaveCharacterParams): Promise<boolean>;
    getCharacters(): Promise<Character[]>;
}

export type SaveCharacterParams = {
    character: Character;
};
