import { Dispatch, SetStateAction, useEffect } from 'react';
import { Status } from '@domain/entities';
import { loadStatuses } from './loadStatuses';

export function useStatusesLoad (
    setStatuses: Dispatch<SetStateAction<Status[]>>
) {
    useEffect(() => {
        loadStatuses(setStatuses);
    }, [setStatuses]);
}
