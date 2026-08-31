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
    const abilityIds = formData.abilities.map(ability => ability.id);
    const proficiencyIds = formData.proficiencies.map(proficiency => proficiency.id);
    const statusIds = formData.statuses.map(status => status.id);
    const assistantId = formData.assistant.id;
    const attributes = filterAttributes(formData.attributes);

    return controller.handle({
        character: {
            id: formData.id,
            name: formData.name,
            activationWord: formData.activationWord,
            prompt: formData.prompt,
            observation: formData.observation,
            assistantId,
            abilityIds,
            proficiencyIds,
            statusIds,
            attributes,
            createdAt: formData.createdAt,
            updatedAt: formData.updatedAt,
        },
    });
}
