import { IGetAbilitiesController } from '@domain/controllers';
import { Dispatch, SetStateAction } from 'react';
import { Ability } from '@domain/entities';

export async function loadAbilities (
    getAbilities: IGetAbilitiesController,
    setAbilities: Dispatch<SetStateAction<Ability[]>>
) {
    try {
        const result = await getAbilities.handle();
        setAbilities(result);
    } catch (error) {
        console.error('Failed to load abilities:', error);
    }
}
