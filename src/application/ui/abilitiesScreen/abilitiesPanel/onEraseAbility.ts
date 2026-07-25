import { Ability } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { onErase } from '../abilitiesForm/onErase';
import { loadAbilities } from '../loadAbilities';

export async function onEraseAbility (
    ability: Ability,
    setAbilities: Dispatch<SetStateAction<Ability[]>>
) {
    await onErase(ability.id);
    await loadAbilities(setAbilities);
}
