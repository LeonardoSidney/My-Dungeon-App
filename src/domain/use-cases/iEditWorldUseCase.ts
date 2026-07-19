import { World } from '../entities';

export interface IEditWorldUseCase {
    execute (request: EditWorldParams): Promise<EditWorldReturn>;
}

export type EditWorldParams = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    createdAt: Date;
};

export type EditWorldReturn = {
    world?: World;
    success: boolean;
    error?: string;
};
