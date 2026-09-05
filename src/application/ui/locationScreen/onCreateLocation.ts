import { CreateLocationRequest, ICreateLocationController } from '@domain/controllers';
import { LocationFormData } from './constants';

export async function onCreateLocation (
    formData: LocationFormData,
    createLocation: ICreateLocationController
) {
    const newLocation: CreateLocationRequest = {
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
    };

    return createLocation.handle(newLocation);
}
