import { Ability } from '../entities';

export interface ICreateAbilityUseCase {
    execute(params: CreateAbilityUseCaseParams): Promise<CreateAbilityUseCaseResponse>;
}

export type CreateAbilityUseCaseParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateAbilityUseCaseResponse = {
    success: boolean;
    ability?: Ability;
    error?: string;
};
