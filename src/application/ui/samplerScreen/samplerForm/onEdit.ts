import { Sampler } from '@domain/entities';
import { editSamplerController } from '@infra/container';

export async function onEdit (
    sampler: Sampler,
) {
    const ctrl = editSamplerController();
    return ctrl.handle(sampler);
}
