import { World } from '../entities';

export interface ICreateWorldController {
    handle(request: CreateWorldRequest): Promise<CreateWorldResponse>;
}

export type CreateWorldRequest = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateWorldResponse = {
    success: boolean;
    world?: World;
    error?: string;
};
