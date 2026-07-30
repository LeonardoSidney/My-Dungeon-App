import { Adventure } from '@domain/entities';
import { AdventureFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { onSubmit } from './adventuresForm/onSubmit';
import { setInitialAdventureState } from './setInitialAdventureState';
import { loadAdventures } from './loadAdventures';

export async function onSaveAdventure(
    adventureStateFormData: AdventureFormData,
    setAdventureFormData: Dispatch<SetStateAction<AdventureFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAdventures: Dispatch<SetStateAction<Adventure[]>>
) {
    await onSubmit(adventureStateFormData);
    setAdventureFormData(setInitialAdventureState());
    setShowForm(false);
    await loadAdventures(setAdventures);
}
