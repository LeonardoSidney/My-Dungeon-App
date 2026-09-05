import { EditWorldMasterControllerParams, EditWorldMasterControllerResponse, IEditWorldMasterController } from '@domain/controllers';
import { WorldMasterFormData } from './constants';

export async function onEditWorldMaster (
    formData: WorldMasterFormData,
    editWorldMaster: IEditWorldMasterController
): Promise<EditWorldMasterControllerResponse> {
    if (!formData.id) {
        return {
            success: false,
            error: 'World master id is required',
        };
    }

    if (!formData.assistant) {
        return {
            success: false,
            error: 'Assistant is required',
        };
    }

    const request: EditWorldMasterControllerParams = {
        id: formData.id,
        editParams: {
            name: formData.name,
            activationWord: formData.activationWord,
            prompt: formData.prompt,
            observation: formData.observation || undefined,
            assistantId: formData.assistant.id,
        },
    };

    return editWorldMaster.handle(request);
}
