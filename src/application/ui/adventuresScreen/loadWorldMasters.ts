import { getWorldMasterController } from '@infra/container';
import { Dispatch } from 'react';
import { WorldMaster } from '@domain/entities';

export async function loadWorldMasters(
    setWorldMasters: Dispatch<React.SetStateAction<WorldMaster[]>>
) {
    try {
        const ctrl = getWorldMasterController();
        const result = await ctrl.handle();
        setWorldMasters(result);
    } catch (error) {
        console.error('Failed to load world masters:', error);
    }
}
