import { Alert } from 'react-native';
import { WorldMaster } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { eraseWorldMasterController } from '@infra/container';
import { loadWorldMasters } from './loadWorldMasters';

export async function onEraseWorldMaster (
    worldMaster: WorldMaster,
    setWorldMasters: Dispatch<SetStateAction<WorldMaster[]>>
) {
    const ctrl = eraseWorldMasterController();
    const response = await ctrl.handle(worldMaster.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to delete world master');
        return;
    }
    await loadWorldMasters(setWorldMasters);
}
