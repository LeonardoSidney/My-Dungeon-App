import { Proficiency } from '../entities';

export interface IGetProficienciesUseCase {
    execute (): Promise<GetProficienciesUseCaseReturn>;
}

export type GetProficienciesUseCaseReturn = {
    success: boolean;
    proficiencies?: Proficiency[];
    error?: string;
};
