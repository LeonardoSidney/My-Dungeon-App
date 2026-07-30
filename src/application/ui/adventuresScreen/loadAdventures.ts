import { getAdventuresController } from '@infra/container';
import { Dispatch } from 'react';
import { Adventure } from '@domain/entities';

export async function loadAdventures(
    setAdventures: Dispatch<React.SetStateAction<Adventure[]>>
) {
    try {
        const ctrl = getAdventuresController();
        const result = await ctrl.handle();
        setAdventures(result);
    } catch (error) {
        console.error('Failed to load adventures:', error);
    }
}
