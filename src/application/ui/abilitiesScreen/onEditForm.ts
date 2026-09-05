import { Ability } from '@domain/entities';
import { AbilityFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { setInitialAbilityState } from './setInitialAbilityState';

export function onEditForm (
    ability: Ability,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAbilityFormData: Dispatch<SetStateAction<AbilityFormData>>,
) {
    setShowForm(true);
    setAbilityFormData(setInitialAbilityState());
    setAbilityFormData({
        id: ability.id,
        name: ability.name,
        activationWord: ability.activationWord,
        prompt: ability.prompt,
        observation: ability.observation ?? '',
    });
}
