import { AdventureFormData } from '../constants';
import { createAdventureController } from '@infra/container';

export async function onCreate (
    formData: AdventureFormData
) {
    const controller = createAdventureController();
    return controller.handle({
        name: formData.name,
        systemPromptIds: formData.systemPrompts.map(sp => sp.id),
        characterIds: formData.characters.map(c => c.id),
        worldMasterId: formData.worldMaster?.id,
        characterAsWorldMasterId: formData.characterAsWorldMasterId,
        charactersControlledByAi: formData.charactersControlledByAi,
        worldIds: (formData.worlds ?? []).map(w => w.id),
        locationIds: (formData.locations ?? []).map(l => l.id),
        itemIds: (formData.items ?? []).map(i => i.id),
    });
}
