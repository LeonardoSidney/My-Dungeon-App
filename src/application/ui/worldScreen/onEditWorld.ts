import { EditWorldControllerParams, EditWorldControllerResponse, IEditWorldController } from '@domain/controllers';
import { WorldFormData } from './constants';

export async function onEditWorld (
    formData: WorldFormData,
    editWorld: IEditWorldController
): Promise<EditWorldControllerResponse> {
    if (!formData.id) {
        return {
            success: false,
            error: 'World id is required',
        };
    }

    const request: EditWorldControllerParams = {
        id: formData.id,
        editParams: {
            name: formData.name,
            activationWord: formData.activationWord,
            prompt: formData.prompt,
            observation: formData.observation || undefined,
        },
    };

    return editWorld.handle(request);
}
