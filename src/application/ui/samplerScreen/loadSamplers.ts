import { getSamplersController } from '@infra/container';
import { Dispatch } from 'react';
import { Sampler } from '@domain/entities';

export async function loadSamplers (
    setSamplers: Dispatch<React.SetStateAction<Sampler[]>>
) {
    try {
        const ctrl = getSamplersController();
        const result = await ctrl.handle();
        setSamplers(result);
    } catch (error) {
        console.error('Failed to load samplers:', error);
    }
}
