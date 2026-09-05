import { WorldMaster } from '@domain/entities';
import { ICreateWorldMasterController, IEditWorldMasterController, IGetWorldMastersController } from '@domain/controllers';
import { WorldMasterFormData, setInitialWorldMasterState } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { onSubmitWorldMaster } from './onSubmitWorldMaster';
import { loadWorldMasters } from './loadWorldMasters';

export async function onSaveWorldMaster (
    worldMasterFormData: WorldMasterFormData,
    createWorldMaster: ICreateWorldMasterController,
    editWorldMaster: IEditWorldMasterController,
    getWorldMasters: IGetWorldMastersController,
    setWorldMasterFormData: Dispatch<SetStateAction<WorldMasterFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setWorldMasters: Dispatch<SetStateAction<WorldMaster[]>>
) {
    const response = await onSubmitWorldMaster(worldMasterFormData, createWorldMaster, editWorldMaster);
    if (!response || !response.success) return;

    setWorldMasterFormData(setInitialWorldMasterState());
    setShowForm(false);
    await loadWorldMasters(getWorldMasters, setWorldMasters);
}
