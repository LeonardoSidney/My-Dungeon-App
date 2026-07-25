import { Status } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { onErase } from '../statusForm/onErase';
import { loadStatuses } from '../loadStatuses';

export async function onEraseStatus (
    status: Status,
    setStatuses: Dispatch<SetStateAction<Status[]>>
) {
    await onErase(status.id);
    await loadStatuses(setStatuses);
}
