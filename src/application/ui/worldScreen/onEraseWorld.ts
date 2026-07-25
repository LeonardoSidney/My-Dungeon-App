import { World } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { onErase } from './worldForm/onErase';
import { loadWorlds } from './loadWorlds';

export async function onEraseWorld (
    world: World,
    setWorlds: Dispatch<SetStateAction<World[]>>
) {
    await onErase(world.id);
    await loadWorlds(setWorlds);
}
