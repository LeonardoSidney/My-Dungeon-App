import { AbilityFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { ICreateAbilityController, IEditAbilityController, IGetAbilitiesController } from '@domain/controllers';
import { onSubmitAbility } from './onSubmitAbility';
import { setInitialAbilityState } from './setInitialAbilityState';
import { loadAbilities } from './loadAbilities';
import { Ability } from '@domain/entities';

export async function onSaveAbility (
    formData: AbilityFormData,
    createAbility: ICreateAbilityController,
    editAbility: IEditAbilityController,
    getAbilities: IGetAbilitiesController,
    setAbilityFormData: Dispatch<SetStateAction<AbilityFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAbilities: Dispatch<SetStateAction<Ability[]>>
) {
    const response = await onSubmitAbility(formData, createAbility, editAbility);
    if (!response || !response.success) return;

    setAbilityFormData(setInitialAbilityState());
    setShowForm(false);
    await loadAbilities(getAbilities, setAbilities);
}
