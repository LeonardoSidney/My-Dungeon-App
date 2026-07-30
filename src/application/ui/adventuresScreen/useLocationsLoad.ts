import { Dispatch, SetStateAction, useEffect } from 'react';
import { Location } from '@domain/entities';
import { loadLocations } from './loadLocations';

export function useLocationsLoad(
    setLocations: Dispatch<SetStateAction<Location[]>>
) {
    useEffect(() => {
        loadLocations(setLocations);
    }, [setLocations]);
}
