import { getStatusesController } from '@infra/container';
import { Dispatch } from 'react';
import { Status } from '@domain/entities';

export async function loadStatuses (
    setStatuses: Dispatch<React.SetStateAction<Status[]>>
) {
    try {
        const ctrl = getStatusesController();
        const result = await ctrl.handle();
        setStatuses(result);
    } catch (error) {
        console.error('Failed to load statuses:', error);
    }
}
