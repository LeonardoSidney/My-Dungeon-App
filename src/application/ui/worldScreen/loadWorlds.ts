import { IGetWorldsController } from '@domain/controllers';
import { Dispatch, SetStateAction } from 'react';
import { World } from '@domain/entities';

export async function loadWorlds (
    getWorlds: IGetWorldsController,
    setWorlds: Dispatch<SetStateAction<World[]>>
) {
    try {
        const result = await getWorlds.handle();
        setWorlds(result);
    } catch (error) {
        console.error('Failed to load worlds:', error);
    }
}
