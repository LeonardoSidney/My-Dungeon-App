import { Sampler } from '@domain/entities';
import { createSamplerController } from '@infra/container';

export async function onCreate (
    samplerData: Omit<Sampler, 'id' | 'createdAt' | 'updatedAt'>,
) {
    const ctrl = createSamplerController();
    return ctrl.handle(samplerData);
}
