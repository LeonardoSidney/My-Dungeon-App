import { setInitialAbilityState } from './setInitialAbilityState';
import { AbilityFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onAddNewAbility (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAbilityFormData: Dispatch<SetStateAction<AbilityFormData>>,
) {
    setShowForm(true);
    setAbilityFormData(setInitialAbilityState());
}
