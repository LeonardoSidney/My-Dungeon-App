import { CreateSystemPromptRequest } from '@domain/controllers';
import { SystemPromptFormData } from '../constants';
import { createSystemPromptController } from '@infra/container';

export async function onCreate (
    formData: SystemPromptFormData,
) {
    const controller = createSystemPromptController();
    const newSystemPrompt: CreateSystemPromptRequest = {
        name: formData.name,
        content: formData.content,
        observation: formData.observation || undefined,
    };

    return controller.handle(newSystemPrompt);
}
