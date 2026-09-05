import { CreateCharacterControllerPrams, ICreateCharacterController } from '@domain/controllers';
import { CharacterFormData } from './constants';
import { filterAttributes } from './filterAttributes';

export async function onCreateCharacter (
    formData: CharacterFormData,
    createCharacter: ICreateCharacterController
) {
    if (!formData.assistant) {
        return {
            success: false,
            error: 'Assistant is required',
        };
    }

    const request: CreateCharacterControllerPrams = {
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
        assistantId: formData.assistant.id,
        abilityIds: formData.abilities.map(ability => ability.id),
        proficiencyIds: formData.proficiencies.map(proficiency => proficiency.id),
        statusIds: formData.statuses.map(status => status.id),
        attributes: filterAttributes(formData.attributes),
    };

    return createCharacter.handle(request);
}
