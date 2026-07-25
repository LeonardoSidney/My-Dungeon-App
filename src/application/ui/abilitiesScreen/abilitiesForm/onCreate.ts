import { CreateAbilityControllerParams } from '@domain/controllers';
import { AbilityFormData } from '../constants';
import { createAbilityController } from '@infra/container';

export async function onCreate (
    formData: AbilityFormData,
) {
    const controller = createAbilityController();
    const newAbility: CreateAbilityControllerParams = {
        name: formData.name,
        prompt: formData.prompt,
        activationWorld: formData.activationWorld,
        observation: formData.observation || undefined,
    };

    return controller.handle(newAbility);
}
