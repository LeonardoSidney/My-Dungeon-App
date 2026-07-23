import { CreateProficiencyControllerParams } from '@domain/controllers';
import { ProficiencyFormData } from '../constants';
import { createProficiencyController } from '@infra/container';

export async function onCreate (
    formData: ProficiencyFormData,
) {
    const controller = createProficiencyController();
    const newProficiency: CreateProficiencyControllerParams = {
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
    };

    return controller.handle(newProficiency);
}
