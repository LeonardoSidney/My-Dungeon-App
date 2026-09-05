import { IGetWorldMastersController } from '@domain/controllers';
import { WorldMaster } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';

export async function loadWorldMasters (
    getWorldMasters: IGetWorldMastersController,
    setWorldMasters: Dispatch<SetStateAction<WorldMaster[]>>
) {
    try {
        const result = await getWorldMasters.handle();
        setWorldMasters(result);
    } catch (error) {
        console.error('Failed to load world masters:', error);
    }
}
