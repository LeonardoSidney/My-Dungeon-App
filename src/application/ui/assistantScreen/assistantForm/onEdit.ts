import { AssistantFormData } from '../constants';
import { editAssistantController } from '@infra/container';

export async function onEdit (
    formData: AssistantFormData
) {
    if (!formData.id) return;
    if (!formData.model) return;
    if (!formData.sampler) return;
    if (!formData.createdAt) return;

    const controller = editAssistantController();
    const modelId = formData.model.id;
    const connectionId = formData.model.connectionId;
    const samplerId = formData.sampler.id;

    return controller.handle({
        id: formData.id,
        name: formData.name,
        observation: formData.observation || undefined,
        modelId,
        connectionId,
        samplerId,
        createdAt: formData.createdAt,
    });
}
