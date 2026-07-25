import { World } from '@domain/entities';
import { WorldFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { onSubmit } from './worldForm/onSubmit';
import { setInitialWorldState } from './constants';
import { loadWorlds } from './loadWorlds';

export async function onSaveWorld (
    worldStateFormData: WorldFormData,
    setWorldFormData: Dispatch<SetStateAction<WorldFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setWorlds: Dispatch<SetStateAction<World[]>>
) {
    await onSubmit(worldStateFormData);
    setWorldFormData(setInitialWorldState());
    setShowForm(false);
    await loadWorlds(setWorlds);
}
