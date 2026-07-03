import { Proficiency } from '../entities';

export interface ICreateProficiencyService {
    createProficiency(params: CreateProficiencyServiceParams): CreateProficiencyServiceReturn;
}

export type CreateProficiencyServiceParams = {
    name: string;
    prompt: string;
    activationWord: string;
    observation?: string;
};

export type CreateProficiencyServiceReturn = {
    success: boolean;
    proficiency?: Proficiency;
    error?: string;
};
