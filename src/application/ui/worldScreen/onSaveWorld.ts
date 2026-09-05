import { World } from '@domain/entities';
import { WorldFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { ICreateWorldController, IEditWorldController, IGetWorldsController } from '@domain/controllers';
import { onSubmitWorld } from './onSubmitWorld';
import { setInitialWorldState } from './constants';
import { loadWorlds } from './loadWorlds';

export async function onSaveWorld (
    formData: WorldFormData,
    createWorld: ICreateWorldController,
    editWorld: IEditWorldController,
    getWorlds: IGetWorldsController,
    setWorldFormData: Dispatch<SetStateAction<WorldFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setWorlds: Dispatch<SetStateAction<World[]>>
) {
    const response = await onSubmitWorld(formData, createWorld, editWorld);
    if (!response || !response.success) return;

    setWorldFormData(setInitialWorldState());
    setShowForm(false);
    await loadWorlds(getWorlds, setWorlds);
}
