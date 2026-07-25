import { eraseSamplerController } from '@infra/container';

export async function onEraseSampler (samplerId: string) {
    const ctrl = eraseSamplerController();
    await ctrl.handle(samplerId);
}
