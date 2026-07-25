import { Dispatch, SetStateAction, useEffect } from 'react';
import { World } from '@domain/entities';
import { loadWorlds } from './loadWorlds';

export function useWorldScreenLogic (
    setWorlds: Dispatch<SetStateAction<World[]>>
) {
    useEffect(() => {
        loadWorlds(setWorlds);
    }, [setWorlds]);
}
