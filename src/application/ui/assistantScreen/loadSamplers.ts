import { IGetSamplersController } from '@domain/controllers';
import { Sampler } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';

export async function loadSamplers (
    getSamplers: IGetSamplersController,
    setSamplers: Dispatch<SetStateAction<Sampler[]>>
) {
    try {
        const result = await getSamplers.handle();
        setSamplers(result);
    } catch (error) {
        console.error('Failed to load samplers:', error);
    }
}
