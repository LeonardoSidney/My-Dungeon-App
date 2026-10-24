import { ProficiencyEditParams } from '../services';

export interface IEditProficiencyController {
    handle (params: EditProficiencyControllerParams): Promise<EditProficiencyControllerResponse>;
}

export type EditProficiencyControllerParams = {
    id: string;
    editParams: ProficiencyEditParams;
};

export type EditProficiencyControllerResponse = {
    id?: string;
    success: boolean;
    error?: string;
};
