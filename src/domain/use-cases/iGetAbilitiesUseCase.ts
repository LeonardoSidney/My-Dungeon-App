import { Ability } from '../entities';

export interface IGetAbilitiesUseCase {
    execute (): Promise<GetAbilitiesUseCaseReturn>;
}

export type GetAbilitiesUseCaseReturn = {
    success: boolean;
    abilities?: Ability[];
    error?: string;
};
