import { EditAssistantControllerParams, IEditAssistantController } from '@domain/controllers';
import { AssistantFormData } from './constants';

export async function onEditAssistant (
    formData: AssistantFormData,
    editAssistant: IEditAssistantController
) {
    if (!formData.id) {
        return {
            success: false,
            error: 'Assistant id is required',
        };
    }

    if (!formData.model) {
        return {
            success: false,
            error: 'Model is required',
        };
    }

    if (!formData.sampler) {
        return {
            success: false,
            error: 'Sampler is required',
        };
    }

    const request: EditAssistantControllerParams = {
        id: formData.id,
        editParams: {
            name: formData.name,
            observation: formData.observation || undefined,
            modelId: formData.model.id,
            connectionId: formData.model.connectionId,
            samplerId: formData.sampler.id,
        },
    };

    return editAssistant.handle(request);
}
