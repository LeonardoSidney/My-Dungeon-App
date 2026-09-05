import { Alert } from 'react-native';
import { IEraseLocationController, IGetLocationsController } from '@domain/controllers';
import { Location } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { loadLocations } from './loadLocations';

export async function onEraseLocation (
    location: Location,
    eraseLocation: IEraseLocationController,
    getLocations: IGetLocationsController,
    setLocations: Dispatch<SetStateAction<Location[]>>
) {
    const response = await eraseLocation.handle(location.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to erase location');
        return;
    }
    await loadLocations(getLocations, setLocations);
}
