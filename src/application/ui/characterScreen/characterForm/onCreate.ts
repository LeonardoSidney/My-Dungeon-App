import { CreateCharacterControllerPrams } from '@domain/controllers';
import { CharacterFormData } from '../constants';
import { createCharacterController } from '@infra/container';
import { filterAttributes } from '../filterAttributes';

export async function onCreate (
    formData: CharacterFormData,
) {
    if (!formData.assistant) return;

    const controller = createCharacterController();
    const abilityIds = formData.abilities.map(ability => ability.id);
    const proficiencyIds = formData.proficiencies.map(proficiency => proficiency.id);
    const statusIds = formData.statuses.map(status => status.id);
    const assistantId = formData.assistant.id;
    const attributes = filterAttributes(formData.attributes);
    const newCharacter: CreateCharacterControllerPrams = {
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
        assistantId,
        abilityIds,
        proficiencyIds,
        statusIds,
        attributes,
    };

    return controller.handle(newCharacter);
}
