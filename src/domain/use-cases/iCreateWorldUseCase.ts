import { World } from '../entities';

export interface ICreateWorldUseCase {
    execute(request: CreateWorldUseCaseParams): Promise<CreateWorldUseCaseResponse>;
}

export type CreateWorldUseCaseParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateWorldUseCaseResponse = {
    success: boolean;
    world?: World;
    error?: string;
};
