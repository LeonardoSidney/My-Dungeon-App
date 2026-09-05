import { EditStatusControllerParams, EditStatusControllerResponse, IEditStatusController } from '@domain/controllers';
import { StatusFormData } from './constants';

export async function onEditStatus (
    formData: StatusFormData,
    editStatus: IEditStatusController
): Promise<EditStatusControllerResponse> {
    if (!formData.id) {
        return {
            success: false,
            error: 'Status id is required',
        };
    }

    const request: EditStatusControllerParams = {
        id: formData.id,
        editParams: {
            name: formData.name,
            activationWord: formData.activationWord,
            prompt: formData.prompt,
            observation: formData.observation || undefined,
        },
    };

    return editStatus.handle(request);
}

