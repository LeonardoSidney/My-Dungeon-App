import { getWorldsController } from '@infra/container';
import { Dispatch } from 'react';
import { World } from '@domain/entities';

export async function loadWorlds (
    setWorlds: Dispatch<React.SetStateAction<World[]>>
) {
    try {
        const ctrl = getWorldsController();
        const result = await ctrl.handle();
        setWorlds(result);
    } catch (error) {
        console.error('Failed to load worlds:', error);
    }
}
