import { Adventure } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';

export function handleWorldMasterSelect (
    setCurrentAdventure: Dispatch<SetStateAction<Adventure>>
) {
    return (adventure: Adventure) => {
        setCurrentAdventure(adventure);
    };
}
