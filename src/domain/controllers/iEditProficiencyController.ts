import { Proficiency } from '../entities';
import { ProficiencyEditParams } from '../services';

export interface IEditProficiencyController {
    handle (params: EditProficiencyControllerParams): Promise<EditProficiencyControllerResponse>;
}

export type EditProficiencyControllerParams = {
    id: string;
    editParams: ProficiencyEditParams;
};

export type EditProficiencyControllerResponse = {
    proficiency?: Proficiency;
    success: boolean;
    error?: string;
};
