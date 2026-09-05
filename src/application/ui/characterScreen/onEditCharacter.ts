import { EditCharacterControllerParams, EditCharacterControllerResponse, IEditCharacterController } from '@domain/controllers';
import { CharacterFormData } from './constants';
import { filterAttributes } from './filterAttributes';

export async function onEditCharacter (
    formData: CharacterFormData,
    editCharacter: IEditCharacterController
): Promise<EditCharacterControllerResponse> {
    if (!formData.id) {
        return {
            success: false,
            error: 'Character id is required',
        };
    }

    if (!formData.assistant) {
        return {
            success: false,
            error: 'Assistant is required',
        };
    }

    const request: EditCharacterControllerParams = {
        id: formData.id,
        editParams: {
            name: formData.name,
            activationWord: formData.activationWord,
            prompt: formData.prompt,
            observation: formData.observation || undefined,
            assistantId: formData.assistant.id,
            abilityIds: formData.abilities.map(ability => ability.id),
            proficiencyIds: formData.proficiencies.map(proficiency => proficiency.id),
            statusIds: formData.statuses.map(status => status.id),
            attributes: filterAttributes(formData.attributes),
        },
    };

    return editCharacter.handle(request);
}
