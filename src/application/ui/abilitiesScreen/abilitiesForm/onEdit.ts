import { AbilityFormData } from '../constants';
import { Ability } from '@domain/entities';
import { editAbilityController } from '@infra/container';

export async function onEdit (
    formData: AbilityFormData
) {
    const controller = editAbilityController();
    const ability: Ability = {
        id: formData.id,
        name: formData.name,
        activationWorld: formData.activationWorld,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
        createdAt: formData.createdAt ?? new Date(),
        updatedAt: formData.updatedAt ?? new Date(),
    };

    return controller.handle({ ability });
}
