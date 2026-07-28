import { getLocationsController } from '@infra/container';
import { Dispatch } from 'react';
import { Location } from '@domain/entities';

export async function loadLocations (
    setLocations: Dispatch<React.SetStateAction<Location[]>>
) {
    try {
        const ctrl = getLocationsController();
        const result = await ctrl.handle();
        setLocations(result);
    } catch (error) {
        console.error('Failed to load locations:', error);
    }
}
