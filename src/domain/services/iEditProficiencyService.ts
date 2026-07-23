import { Proficiency } from '../entities';

export interface IEditProficiencyService {
    editProficiency (params: EditProficiencyServiceParams): EditProficiencyServiceReturn;
}

export type EditProficiencyServiceParams = {
    proficiency: Proficiency;
};

export type EditProficiencyServiceReturn = {
    proficiency?: Proficiency;
    success: boolean;
    error?: string;
};
