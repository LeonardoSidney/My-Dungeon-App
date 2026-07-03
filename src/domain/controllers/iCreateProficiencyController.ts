import { Proficiency } from '../entities';

export interface ICreateProficiencyController {
    handle(params: CreateProficiencyControllerParams): Promise<CreateProficiencyControllerResponse>;
}

export type CreateProficiencyControllerParams = {
    name: string;
    prompt: string;
    activationWord: string;
    observation?: string;
};

export type CreateProficiencyControllerResponse = {
    success: boolean;
    proficiency?: Proficiency;
    error?: string;
};
