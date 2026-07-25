import { Dispatch, SetStateAction, useEffect } from 'react';
import { Ability } from '@domain/entities';
import { loadAbilities } from './loadAbilities';

export function useAbilitiesScreenLogic (
    setAbilities: Dispatch<SetStateAction<Ability[]>>
) {
    useEffect(() => {
        loadAbilities(setAbilities);
    }, [setAbilities]);
}
