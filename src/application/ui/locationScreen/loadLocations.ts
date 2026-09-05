import { IGetLocationsController } from '@domain/controllers';
import { Dispatch } from 'react';
import { Location } from '@domain/entities';

export async function loadLocations (
    getLocations: IGetLocationsController,
    setLocations: Dispatch<React.SetStateAction<Location[]>>
) {
    try {
        const result = await getLocations.handle();
        setLocations(result);
    } catch (error) {
        console.error('Failed to load locations:', error);
    }
}
