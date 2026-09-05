import { Alert } from 'react-native';
import { IEraseWorldMasterController, IGetWorldMastersController } from '@domain/controllers';
import { WorldMaster } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { loadWorldMasters } from './loadWorldMasters';

export async function onEraseWorldMaster (
    worldMaster: WorldMaster,
    eraseWorldMaster: IEraseWorldMasterController,
    getWorldMasters: IGetWorldMastersController,
    setWorldMasters: Dispatch<SetStateAction<WorldMaster[]>>
) {
    const response = await eraseWorldMaster.handle(worldMaster.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to delete world master');
        return;
    }
    await loadWorldMasters(getWorldMasters, setWorldMasters);
}
