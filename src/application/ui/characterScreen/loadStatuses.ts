import { IGetStatusesController } from '@domain/controllers';
import { Dispatch, SetStateAction } from 'react';
import { Status } from '@domain/entities';

export async function loadStatuses (
    getStatuses: IGetStatusesController,
    setStatuses: Dispatch<SetStateAction<Status[]>>
) {
    try {
        const result = await getStatuses.handle();
        setStatuses(result);
    } catch (error) {
        console.error('Failed to load statuses:', error);
    }
}
