import { AbilityFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { onSubmit } from './abilitiesForm/onSubmit';
import { setInitialAbilityState } from './setInitialAbilityState';
import { loadAbilities } from './loadAbilities';
import { Ability } from '@domain/entities';

export async function onSaveAbility (
    formData: AbilityFormData,
    setAbilityFormData: Dispatch<SetStateAction<AbilityFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAbilities: Dispatch<SetStateAction<Ability[]>>
) {
    await onSubmit(formData);
    setAbilityFormData(setInitialAbilityState());
    setShowForm(false);
    await loadAbilities(setAbilities);
}
