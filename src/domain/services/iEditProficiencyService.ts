import { Proficiency } from '../entities';

export type ProficiencyEditParams = Omit<Proficiency, 'id' | 'createdAt' | 'updatedAt'>;

export interface IEditProficiencyService {
    editProficiency (params: EditProficiencyServiceParams): EditProficiencyServiceReturn;
}

export type EditProficiencyServiceParams = {
    proficiency: Proficiency;
    editParams: ProficiencyEditParams;
};

export type EditProficiencyServiceReturn = {
    proficiency?: Proficiency;
    success: boolean;
    error?: string;
};
