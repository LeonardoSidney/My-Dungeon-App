import { CreateStatusControllerParams } from '@domain/controllers';
import { StatusFormData } from '../constants';
import { createStatusController } from '@infra/container';

export async function onCreate (
    formData: StatusFormData,
) {
    const controller = createStatusController();
    const newStatus: CreateStatusControllerParams = {
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
    };

    return controller.handle(newStatus);
}
