import { EditWorldControllerRequest } from '@domain/controllers';
import { WorldFormData } from '../constants';
import { editWorldController } from '@infra/container';

export async function onEdit (
    formData: WorldFormData
) {
    const controller = editWorldController();
    const request: EditWorldControllerRequest = {
        id: formData.id!,
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
        createdAt: formData.createdAt ?? new Date(),
    };

    return controller.handle(request);
}
