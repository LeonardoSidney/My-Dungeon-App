import { Sampler } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { eraseSamplerController } from '@infra/container';
import { loadSamplers } from './loadSamplers';

export async function onEraseSampler (
    sampler: Sampler,
    setSamplers: Dispatch<SetStateAction<Sampler[]>>
) {
    try {
        const ctrl = eraseSamplerController();
        await ctrl.handle(sampler.id);
        await loadSamplers(setSamplers);
    } catch (error) {
        console.error('Failed to erase sampler:', error);
    }
}
