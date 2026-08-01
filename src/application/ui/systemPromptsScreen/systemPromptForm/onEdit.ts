import { SystemPromptFormData } from '../constants';
import { SystemPrompt } from '@domain/entities';
import { editSystemPromptController } from '@infra/container';

export async function onEdit (
    formData: SystemPromptFormData
) {
    const controller = editSystemPromptController();
    const systemPrompt: SystemPrompt = {
        id: formData.id,
        name: formData.name,
        content: formData.content,
        observation: formData.observation || undefined,
        createdAt: formData.createdAt ?? new Date(),
        updatedAt: formData.updatedAt ?? new Date(),
    };

    return controller.handle({ systemPrompt });
}
