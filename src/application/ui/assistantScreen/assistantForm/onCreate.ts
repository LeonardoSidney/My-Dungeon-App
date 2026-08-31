import { CreateAssistantControllerParams } from '@domain/controllers';
import { AssistantFormData } from '../constants';
import { createAssistantController } from '@infra/container';

export async function onCreate (
    formData: AssistantFormData,
) {
    if (!formData.model) return;
    if (!formData.sampler) return;

    const controller = createAssistantController();
    const modelId = formData.model.id;
    const connectionId = formData.model.connectionId;
    const samplerId = formData.sampler.id;
    const newAssistant: CreateAssistantControllerParams = {
        name: formData.name,
        observation: formData.observation || undefined,
        modelId,
        connectionId,
        samplerId,
    };

    return controller.handle(newAssistant);
}
