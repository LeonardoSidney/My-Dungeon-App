import { Dispatch, SetStateAction } from 'react';
import { World } from '@domain/entities';
import { getWorldsController } from '@infra/container';

export async function loadWorlds (
    setWorlds: Dispatch<SetStateAction<World[]>>
) {
    try {
        const ctrl = getWorldsController();
        const result = await ctrl.handle();
        setWorlds(result);
    } catch (error) {
        console.error('Failed to load worlds:', error);
    }
}
