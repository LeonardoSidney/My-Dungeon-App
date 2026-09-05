import { CreateWorldMasterControllerParams, ICreateWorldMasterController } from '@domain/controllers';
import { WorldMasterFormData } from './constants';

export async function onCreateWorldMaster (
    formData: WorldMasterFormData,
    createWorldMaster: ICreateWorldMasterController
) {
    if (!formData.assistant) {
        return {
            success: false,
            error: 'Assistant is required',
        };
    }

    const request: CreateWorldMasterControllerParams = {
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
        assistantId: formData.assistant.id,
    };

    return createWorldMaster.handle(request);
}
