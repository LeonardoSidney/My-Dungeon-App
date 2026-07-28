import { Dispatch, SetStateAction, useEffect } from 'react';
import { Adventure } from '@domain/entities';
import { loadAdventures } from './loadAdventures';

export function useAdventuresScreenLogic (
    setAdventures: Dispatch<SetStateAction<Adventure[]>>
) {
    useEffect(() => {
        loadAdventures(setAdventures);
    }, [setAdventures]);
}
