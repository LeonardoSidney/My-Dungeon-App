import { World } from '../entities';

export type EditWorldControllerRequest = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    createdAt: Date;
};

export type EditWorldControllerResponse = {
    success: boolean;
    world?: World;
    error?: string;
};

export interface IEditWorldController {
    handle (request: EditWorldControllerRequest): Promise<EditWorldControllerResponse>;
}
