import { CreateAbilityControllerParams, ICreateAbilityController } from '@domain/controllers';
import { AbilityFormData } from './constants';

export async function onCreateAbility (
    formData: AbilityFormData,
    createAbility: ICreateAbilityController
) {
    const newAbility: CreateAbilityControllerParams = {
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
    };

    return createAbility.handle(newAbility);
}
