import { LocationFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { ICreateLocationController, IEditLocationController, IGetLocationsController } from '@domain/controllers';
import { onSubmitLocation } from './onSubmitLocation';
import { setInitialLocationState } from './setInitialLocationState';
import { loadLocations } from './loadLocations';
import { Location } from '@domain/entities';

export async function onSaveLocation (
    formData: LocationFormData,
    createLocation: ICreateLocationController,
    editLocation: IEditLocationController,
    getLocations: IGetLocationsController,
    setLocationFormData: Dispatch<SetStateAction<LocationFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setLocations: Dispatch<SetStateAction<Location[]>>
) {
    const response = await onSubmitLocation(formData, createLocation, editLocation);
    if (!response || !response.success) return;

    setLocationFormData(setInitialLocationState());
    setShowForm(false);
    await loadLocations(getLocations, setLocations);
}
