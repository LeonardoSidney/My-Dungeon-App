import { Proficiency } from '../entities';

export interface IEditProficiencyController {
    handle (params: EditProficiencyControllerParams): Promise<EditProficiencyControllerResponse>;
}

export type EditProficiencyControllerParams = {
    proficiency: Proficiency;
};

export type EditProficiencyControllerResponse = {
    proficiency?: Proficiency;
    success: boolean;
    error?: string;
};
