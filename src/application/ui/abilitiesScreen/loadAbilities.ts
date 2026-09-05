import { IGetAbilitiesController } from '@domain/controllers';
import { Dispatch } from 'react';
import { Ability } from '@domain/entities';

export async function loadAbilities (
    getAbilities: IGetAbilitiesController,
    setAbilities: Dispatch<React.SetStateAction<Ability[]>>
) {
    try {
        const result = await getAbilities.handle();
        setAbilities(result);
    } catch (error) {
        console.error('Failed to load abilities:', error);
    }
}
