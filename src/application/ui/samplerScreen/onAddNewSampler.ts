import { setInitialSamplerState } from './setInitialSamplerState';
import { SamplerFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onAddNewSampler (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setSamplerFormData: Dispatch<SetStateAction<SamplerFormData>>,
) {
    setShowForm(true);
    setSamplerFormData(setInitialSamplerState());
}
