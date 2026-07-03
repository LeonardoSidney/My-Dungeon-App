import { Proficiency } from '../entities';

export interface ICreateProficiencyUseCase {
    execute(params: CreateProficiencyUseCaseParams): Promise<CreateProficiencyUseCaseResponse>;
}

export type CreateProficiencyUseCaseParams = {
    name: string;
    prompt: string;
    activationWord: string;
    observation?: string;
};

export type CreateProficiencyUseCaseResponse = {
    success: boolean;
    proficiency?: Proficiency;
    error?: string;
};
