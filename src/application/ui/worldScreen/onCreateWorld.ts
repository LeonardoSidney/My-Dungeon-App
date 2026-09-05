import { CreateWorldRequest, ICreateWorldController } from '@domain/controllers';
import { WorldFormData } from './constants';

export async function onCreateWorld (
    formData: WorldFormData,
    createWorld: ICreateWorldController
) {
    const newWorld: CreateWorldRequest = {
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
    };

    return createWorld.handle(newWorld);
}
