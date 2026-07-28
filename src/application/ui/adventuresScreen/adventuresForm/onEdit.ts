import { AdventureFormData } from '../constants';
import { editAdventureController } from '@infra/container';

export async function onEdit (
    formData: AdventureFormData
) {
    if (!formData.id) return;

    const controller = editAdventureController();
    await controller.handle({
        id: formData.id,
        name: formData.name,
        systemPrompts: formData.systemPrompts,
        characters: formData.characters,
        worldMaster: formData.worldMaster,
        worlds: formData.worlds,
        locations: formData.locations,
        items: formData.items,
        chat: formData.chat,
        createdAt: formData.createdAt,
    });
}
