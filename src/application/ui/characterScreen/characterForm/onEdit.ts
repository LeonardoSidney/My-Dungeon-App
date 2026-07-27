import { CharacterFormData } from '../constants';
import { editCharacterController } from '@infra/container';
import { filterAttributes } from '../filterAttributes';

export async function onEdit (
    formData: CharacterFormData
) {
    if (!formData.id) return;
    if (!formData.assistant) return;
    if (!formData.createdAt) return;
    if (!formData.updatedAt) return;

    const controller = editCharacterController();

    return controller.handle({
        character: {
            id: formData.id,
            name: formData.name,
            activationWord: formData.activationWord,
            prompt: formData.prompt,
            observation: formData.observation,
            assistant: formData.assistant,
            abilities: formData.abilities,
            proficiencies: formData.proficiencies,
            statuses: formData.statuses,
            attributes: filterAttributes(formData.attributes),
            createdAt: formData.createdAt,
            updatedAt: formData.updatedAt,
        },
    });
}
