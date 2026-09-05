import { EditAbilityControllerParams, EditAbilityControllerResponse, IEditAbilityController } from '@domain/controllers';
import { AbilityFormData } from './constants';

export async function onEditAbility (
    formData: AbilityFormData,
    editAbility: IEditAbilityController
): Promise<EditAbilityControllerResponse> {
    if (!formData.id) {
        return {
            success: false,
            error: 'Ability id is required',
        };
    }

    const request: EditAbilityControllerParams = {
        id: formData.id,
        editParams: {
            name: formData.name,
            activationWord: formData.activationWord,
            prompt: formData.prompt,
            observation: formData.observation || undefined,
        },
    };

    return editAbility.handle(request);
}
