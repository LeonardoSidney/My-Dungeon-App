import { eraseAbilityController } from '@infra/container';

export async function onErase (abilityId: string) {
    const controller = eraseAbilityController();
    return controller.handle(abilityId);
}
