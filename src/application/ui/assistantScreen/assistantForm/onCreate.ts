import { CreateAssistantControllerParams } from '@domain/controllers';
import { AssistantFormData } from '../constants';
import { createAssistantController } from '@infra/container';

export async function onCreate (
    formData: AssistantFormData,
) {
    if (!formData.model) return;
    if (!formData.sampler) return;

    const controller = createAssistantController();
    const newAssistant: CreateAssistantControllerParams = {
        name: formData.name,
        observation: formData.observation || undefined,
        model: formData.model,
        sampler: formData.sampler,
    };

    return controller.handle(newAssistant);
}
