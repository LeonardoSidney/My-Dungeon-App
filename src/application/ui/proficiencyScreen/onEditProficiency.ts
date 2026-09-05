import { EditProficiencyControllerParams, EditProficiencyControllerResponse, IEditProficiencyController } from '@domain/controllers';
import { ProficiencyFormData } from './constants';

export async function onEditProficiency (
    formData: ProficiencyFormData,
    editProficiency: IEditProficiencyController
): Promise<EditProficiencyControllerResponse> {
    if (!formData.id) {
        return {
            success: false,
            error: 'Proficiency id is required',
        };
    }

    const request: EditProficiencyControllerParams = {
        id: formData.id,
        editParams: {
            name: formData.name,
            activationWord: formData.activationWord,
            prompt: formData.prompt,
            observation: formData.observation || undefined,
        },
    };

    return editProficiency.handle(request);
}
