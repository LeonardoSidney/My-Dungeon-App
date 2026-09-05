import { SystemPromptFormData } from '../constants';
import { EditSystemPromptControllerParams } from '@domain/controllers';
import { editSystemPromptController } from '@infra/container';

export async function onEdit (
    formData: SystemPromptFormData
) {
    const controller = editSystemPromptController();
    const request: EditSystemPromptControllerParams = {
        id: formData.id!,
        editParams: {
            name: formData.name,
            content: formData.content,
            observation: formData.observation || undefined,
        },
    };

    return controller.handle(request);
}
