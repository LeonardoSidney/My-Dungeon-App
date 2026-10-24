import { Proficiency } from '../entities';

export interface IGetProficiencyByIdUseCase {
    execute (params: GetProficiencyByIdUseCaseParams): Promise<GetProficiencyByIdUseCaseReturn>;
}

export type GetProficiencyByIdUseCaseParams = {
    id: string;
};

export type GetProficiencyByIdUseCaseReturn = {
    success: boolean;
    proficiency?: Proficiency;
    error?: string;
};
