import { CreateStatusControllerParams, ICreateStatusController } from '@domain/controllers';
import { StatusFormData } from './constants';

export async function onCreateStatus (
    formData: StatusFormData,
    createStatus: ICreateStatusController
) {
    const newStatus: CreateStatusControllerParams = {
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
    };

    return createStatus.handle(newStatus);
}
