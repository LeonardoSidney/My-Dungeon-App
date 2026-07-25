import { SamplerFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { onSubmit } from './samplerForm/onSubmit';
import { setInitialSamplerState } from './setInitialSamplerState';
import { loadSamplers } from './loadSamplers';
import { Sampler } from '@domain/entities';

export async function onSaveSampler (
    formData: SamplerFormData,
    setSamplerFormData: Dispatch<SetStateAction<SamplerFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setSamplers: Dispatch<SetStateAction<Sampler[]>>
) {
    await onSubmit(formData);
    setSamplerFormData(setInitialSamplerState());
    setShowForm(false);
    await loadSamplers(setSamplers);
}
