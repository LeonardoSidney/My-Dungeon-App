import { World } from '../entities';

export interface IEditWorldService {
    editWorld(request: EditWorldServiceParams): EditWorldServiceReturn;
}

export type EditWorldServiceParams = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    createdAt: Date;
};

export type EditWorldServiceReturn = {
    success: boolean;
    world?: World;
    error?: string;
};
