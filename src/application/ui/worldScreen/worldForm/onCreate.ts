import { CreateWorldRequest } from '@domain/controllers';
import { WorldFormData } from '../constants';
import { createWorldController } from '@infra/container';

export async function onCreate (
    formData: WorldFormData,
) {
    const controller = createWorldController();
    const newWorld: CreateWorldRequest = {
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
    };

    return controller.handle(newWorld);
}
