import { Dispatch, SetStateAction, useEffect } from 'react';
import { WorldMaster } from '@domain/entities';
import { loadWorldMasters } from './loadWorldMasters';

export function useWorldMastersLoad(
    setWorldMasters: Dispatch<SetStateAction<WorldMaster[]>>
) {
    useEffect(() => {
        loadWorldMasters(setWorldMasters);
    }, [setWorldMasters]);
}
