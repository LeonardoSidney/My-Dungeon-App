import { Proficiency } from '../entities';
import { ProficiencyEditParams } from '../services';

export interface IEditProficiencyUseCase {
    execute (request: EditProficiencyParams): Promise<EditProficiencyReturn>;
}

export type EditProficiencyParams = {
    id: string;
    editParams: ProficiencyEditParams;
};

export type EditProficiencyReturn = {
    proficiency?: Proficiency;
    success: boolean;
    error?: string;
};
