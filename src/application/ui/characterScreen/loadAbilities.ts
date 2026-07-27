import { getAbilitiesController } from '@infra/container';
import { Dispatch } from 'react';
import { Ability } from '@domain/entities';

export async function loadAbilities (
    setAbilities: Dispatch<React.SetStateAction<Ability[]>>
) {
    try {
        const ctrl = getAbilitiesController();
        const result = await ctrl.handle();
        setAbilities(result);
    } catch (error) {
        console.error('Failed to load abilities:', error);
    }
}
