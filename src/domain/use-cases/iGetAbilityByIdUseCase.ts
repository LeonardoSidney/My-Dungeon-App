import { Ability } from '../entities';

export interface IGetAbilityByIdUseCase {
    execute (params: GetAbilityByIdUseCaseParams): Promise<GetAbilityByIdUseCaseReturn>;
}

export type GetAbilityByIdUseCaseParams = {
    id: string;
};

export type GetAbilityByIdUseCaseReturn = {
    success: boolean;
    ability?: Ability;
    error?: string;
};
