import { CharacterEditParams } from '../services';

export interface IEditCharacterUseCase {
    execute (params: EditCharacterParams): Promise<EditCharacterReturn>;
}

export type EditCharacterParams = {
    id: string;
    editParams: CharacterEditParams;
};

export type EditCharacterReturn = {
    id?: string;
    success: boolean;
    error?: string;
};
