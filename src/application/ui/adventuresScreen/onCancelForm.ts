import { Dispatch, SetStateAction } from 'react';
import { AdventureFormData } from './constants';
import { setInitialAdventureState } from './setInitialAdventureState';

export function onCancelForm(
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAdventureFormData: Dispatch<SetStateAction<AdventureFormData>>
) {
    setAdventureFormData(setInitialAdventureState());
    setShowForm(false);
}
