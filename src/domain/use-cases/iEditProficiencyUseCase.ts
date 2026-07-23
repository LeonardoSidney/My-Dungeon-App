import { Proficiency } from '../entities';

export interface IEditProficiencyUseCase {
    execute (request: EditProficiencyParams): Promise<EditProficiencyReturn>;
}

export type EditProficiencyParams = {
    proficiency: Proficiency;
};

export type EditProficiencyReturn = {
    proficiency?: Proficiency;
    success: boolean;
    error?: string;
};
