import { setInitialSamplerState } from './setInitialSamplerState';
import { SamplerFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onCancelForm (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setSamplerFormData: Dispatch<SetStateAction<SamplerFormData>>,
) {
    setShowForm(false);
    setSamplerFormData(setInitialSamplerState());
}
