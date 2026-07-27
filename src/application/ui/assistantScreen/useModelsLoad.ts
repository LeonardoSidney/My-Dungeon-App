import { useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Model } from '@domain/entities';
import { loadModels } from './loadModels';

export function useModelsLoad (
    setModels: Dispatch<SetStateAction<Model[]>>
) {
    useEffect(() => {
        loadModels(setModels);
    }, [setModels]);
}
