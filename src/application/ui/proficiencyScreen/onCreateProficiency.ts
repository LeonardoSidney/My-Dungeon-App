import { CreateProficiencyControllerParams, ICreateProficiencyController } from '@domain/controllers';
import { ProficiencyFormData } from './constants';

export async function onCreateProficiency (
    formData: ProficiencyFormData,
    createProficiency: ICreateProficiencyController
) {
    const newProficiency: CreateProficiencyControllerParams = {
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
    };

    return createProficiency.handle(newProficiency);
}
