import { setInitialLocationState } from './setInitialLocationState';
import { LocationFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onCancelForm (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setLocationFormData: Dispatch<SetStateAction<LocationFormData>>,
) {
    setShowForm(false);
    setLocationFormData(setInitialLocationState());
}
