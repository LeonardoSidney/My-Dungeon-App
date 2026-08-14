import { Dispatch, SetStateAction, useEffect } from 'react';
import { World } from '@domain/entities';
import { loadWorlds } from './loadWorlds';

export function useWorldsLoad (setWorlds: Dispatch<SetStateAction<World[]>>) {
    useEffect(() => {
        loadWorlds(setWorlds);
    }, [setWorlds]);
}
