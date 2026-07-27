import { useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Sampler } from '@domain/entities';
import { loadSamplers } from './loadSamplers';

export function useSamplersLoad (
    setSamplers: Dispatch<SetStateAction<Sampler[]>>
) {
    useEffect(() => {
        loadSamplers(setSamplers);
    }, [setSamplers]);
}
