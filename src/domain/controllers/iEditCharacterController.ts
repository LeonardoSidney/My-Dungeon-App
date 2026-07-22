import { Character } from '../entities';

export type EditCharacterControllerRequest = {
    character: Character;
};

export type EditCharacterControllerResponse = {
    success: boolean;
    character?: Character;
    error?: string;
};

export interface IEditCharacterController {
    handle (request: EditCharacterControllerRequest): Promise<EditCharacterControllerResponse>;
}
