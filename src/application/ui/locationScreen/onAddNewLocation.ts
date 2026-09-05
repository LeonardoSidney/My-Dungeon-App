import { setInitialLocationState } from './setInitialLocationState';
import { LocationFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onAddNewLocation (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setLocationFormData: Dispatch<SetStateAction<LocationFormData>>,
) {
    setShowForm(true);
    setLocationFormData(setInitialLocationState());
}
