import { EditLocationControllerParams, EditLocationControllerResponse, IEditLocationController } from '@domain/controllers';
import { LocationFormData } from './constants';

export async function onEditLocation (
    formData: LocationFormData,
    editLocation: IEditLocationController
): Promise<EditLocationControllerResponse> {
    if (!formData.id) {
        return {
            success: false,
            error: 'Location id is required',
        };
    }

    const request: EditLocationControllerParams = {
        id: formData.id,
        editParams: {
            name: formData.name,
            activationWord: formData.activationWord,
            prompt: formData.prompt,
            observation: formData.observation || undefined,
        },
    };

    return editLocation.handle(request);
}
