import { WorldMaster } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { getWorldMasterController } from '@infra/container';

export async function loadWorldMasters (
    setWorldMasters: Dispatch<SetStateAction<WorldMaster[]>>
) {
    try {
        const ctrl = getWorldMasterController();
        const result = await ctrl.handle();
        setWorldMasters(result);
    } catch (error) {
        console.error('Failed to load world masters:', error);
    }
}
