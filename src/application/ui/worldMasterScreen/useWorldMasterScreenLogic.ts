import { useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { WorldMaster } from '@domain/entities';
import { loadWorldMasters } from './loadWorldMasters';

export function useWorldMasterScreenLogic (
    setWorldMasters: Dispatch<SetStateAction<WorldMaster[]>>
) {
    useEffect(() => {
        loadWorldMasters(setWorldMasters);
    }, [setWorldMasters]);
}
