import { Character } from '../entities';
import { CharacterEditParams } from '../services';

export type EditCharacterControllerParams = {
    id: string;
    editParams: CharacterEditParams;
};

export type EditCharacterControllerResponse = {
    success: boolean;
    character?: Character;
    error?: string;
};

export interface IEditCharacterController {
    handle (request: EditCharacterControllerParams): Promise<EditCharacterControllerResponse>;
}
