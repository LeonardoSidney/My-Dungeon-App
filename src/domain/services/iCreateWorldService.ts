import { World } from '../entities';

export interface ICreateWorldService {
    createWorld(params: CreateWorldServiceParams): CreateWorldServiceResponse;
}

export type CreateWorldServiceParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateWorldServiceResponse = {
    success: boolean;
    world?: World;
    error?: string;
};
