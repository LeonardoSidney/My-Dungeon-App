import { eraseProficiencyController } from '@infra/container';

export async function onErase (proficiencyId: string) {
    const controller = eraseProficiencyController();
    return controller.handle(proficiencyId);
}
