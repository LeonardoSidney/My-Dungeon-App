import { Dispatch, SetStateAction } from 'react';
import { AdventureFormData } from './constants';
import { setInitialAdventureState } from './setInitialAdventureState';

export function onAddNewAdventure (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAdventureFormData: Dispatch<SetStateAction<AdventureFormData>>
) {
    setAdventureFormData(setInitialAdventureState());
    setShowForm(true);
}
