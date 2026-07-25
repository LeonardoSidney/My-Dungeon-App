import { eraseWorldController } from '@infra/container';

export async function onErase (worldId: string) {
    const controller = eraseWorldController();
    return controller.handle(worldId);
}
