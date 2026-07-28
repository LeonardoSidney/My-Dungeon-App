import { AdventureFormData } from '../constants';
import { createAdventureController } from '@infra/container';

export async function onCreate (
    formData: AdventureFormData
) {
    const controller = createAdventureController();
    await controller.handle({
        name: formData.name,
        systemPrompts: formData.systemPrompts,
        characters: formData.characters,
        worldMaster: formData.worldMaster,
        worlds: formData.worlds,
        locations: formData.locations,
        items: formData.items,
    });
}
