import { WorldMaster } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { eraseWorldMasterController } from '@infra/container';
import { loadWorldMasters } from './loadWorldMasters';

export async function onEraseWorldMaster (
    worldMaster: WorldMaster,
    setWorldMasters: Dispatch<SetStateAction<WorldMaster[]>>
) {
    try {
        const ctrl = eraseWorldMasterController();
        await ctrl.handle(worldMaster.id);
        await loadWorldMasters(setWorldMasters);
    } catch (error) {
        console.error('Failed to delete world master:', error);
    }
}
