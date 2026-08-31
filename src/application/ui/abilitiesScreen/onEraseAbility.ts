import { Alert } from 'react-native';
import { Ability } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { onErase } from './abilitiesForm/onErase';
import { loadAbilities } from './loadAbilities';

export async function onEraseAbility (
    ability: Ability,
    setAbilities: Dispatch<SetStateAction<Ability[]>>
) {
    const response = await onErase(ability.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to erase ability');
        return;
    }
    await loadAbilities(setAbilities);
}
