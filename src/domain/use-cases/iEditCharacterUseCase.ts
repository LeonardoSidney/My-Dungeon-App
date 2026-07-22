import { Character } from '../entities';

export interface IEditCharacterUseCase {
    execute (params: EditCharacterParams): Promise<EditCharacterReturn>;
}

export type EditCharacterParams = {
    character: Character;
};

export type EditCharacterReturn = {
    character?: Character;
    success: boolean;
    error?: string;
};
