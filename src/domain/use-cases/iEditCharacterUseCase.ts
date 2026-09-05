import { Character } from '../entities';
import { CharacterEditParams } from '../services';

export interface IEditCharacterUseCase {
    execute (params: EditCharacterParams): Promise<EditCharacterReturn>;
}

export type EditCharacterParams = {
    id: string;
    editParams: CharacterEditParams;
};

export type EditCharacterReturn = {
    character?: Character;
    success: boolean;
    error?: string;
};
