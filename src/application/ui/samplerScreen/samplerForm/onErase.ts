import { eraseSamplerController } from '@infra/container';

export async function onErase (samplerId: string) {
    const ctrl = eraseSamplerController();
    return ctrl.handle(samplerId);
}
