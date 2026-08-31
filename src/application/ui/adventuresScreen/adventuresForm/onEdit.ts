import { AdventureFormData } from '../constants';
import { editAdventureController } from '@infra/container';

export async function onEdit (
    formData: AdventureFormData
) {
    if (!formData.id) return;

    const controller = editAdventureController();
    return controller.handle({
        id: formData.id,
        name: formData.name,
        systemPromptIds: formData.systemPrompts.map(sp => sp.id),
        characterIds: formData.characters.map(c => c.id),
        worldMasterId: formData.worldMaster?.id,
        characterAsWorldMasterId: formData.characterAsWorldMasterId,
        charactersControlledByAi: formData.charactersControlledByAi,
        worldIds: (formData.worlds ?? []).map(w => w.id),
        locationIds: (formData.locations ?? []).map(l => l.id),
        itemIds: (formData.items ?? []).map(i => i.id),
        chat: formData.chat,
        createdAt: formData.createdAt,
    });
}
