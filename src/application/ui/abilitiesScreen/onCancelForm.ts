import { setInitialAbilityState } from './setInitialAbilityState';
import { AbilityFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onCancelForm (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAbilityFormData: Dispatch<SetStateAction<AbilityFormData>>,
) {
    setShowForm(false);
    setAbilityFormData(setInitialAbilityState());
}
