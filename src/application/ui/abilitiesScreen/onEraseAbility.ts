import { Alert } from 'react-native';
import { IEraseAbilityController, IGetAbilitiesController } from '@domain/controllers';
import { Ability } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { loadAbilities } from './loadAbilities';

export async function onEraseAbility (
    ability: Ability,
    eraseAbility: IEraseAbilityController,
    getAbilities: IGetAbilitiesController,
    setAbilities: Dispatch<SetStateAction<Ability[]>>
) {
    const response = await eraseAbility.handle(ability.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to erase ability');
        return;
    }
    await loadAbilities(getAbilities, setAbilities);
}
