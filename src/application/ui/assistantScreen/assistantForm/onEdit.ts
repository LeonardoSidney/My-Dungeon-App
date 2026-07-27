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

    return controller.handle({
        id: formData.id,
        name: formData.name,
        observation: formData.observation || undefined,
        model: formData.model,
        sampler: formData.sampler,
        createdAt: formData.createdAt,
    });
}
