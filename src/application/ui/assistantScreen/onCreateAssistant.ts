import { CreateAssistantControllerParams, ICreateAssistantController } from '@domain/controllers';
import { AssistantFormData } from './constants';

export async function onCreateAssistant (
    formData: AssistantFormData,
    createAssistant: ICreateAssistantController
) {
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

    const request: CreateAssistantControllerParams = {
        name: formData.name,
        observation: formData.observation || undefined,
        modelId: formData.model.id,
        connectionId: formData.model.connectionId,
        samplerId: formData.sampler.id,
    };

    return createAssistant.handle(request);
}
