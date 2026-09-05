import { Location } from '@domain/entities';
import { LocationFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { setInitialLocationState } from './setInitialLocationState';

export function onEditForm (
    location: Location,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setLocationFormData: Dispatch<SetStateAction<LocationFormData>>,
) {
    setShowForm(true);
    setLocationFormData(setInitialLocationState());
    setLocationFormData({
        id: location.id,
        name: location.name,
        activationWord: location.activationWord,
        prompt: location.prompt,
        observation: location.observation ?? '',
    });
}
