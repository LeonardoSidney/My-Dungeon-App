import { CreateCharacterControllerPrams } from '@domain/controllers';
import { CharacterFormData } from '../constants';
import { createCharacterController } from '@infra/container';
import { filterAttributes } from '../filterAttributes';

export async function onCreate (
    formData: CharacterFormData,
) {
    if (!formData.assistant) return;

    const controller = createCharacterController();
    const newCharacter: CreateCharacterControllerPrams = {
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
        assistant: formData.assistant,
        abilities: formData.abilities,
        proficiencies: formData.proficiencies,
        statuses: formData.statuses,
        attributes: filterAttributes(formData.attributes),
    };

    return controller.handle(newCharacter);
}
