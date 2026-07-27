import { Dispatch, SetStateAction, useEffect } from 'react';
import { Proficiency } from '@domain/entities';
import { loadProficiencies } from './loadProficiencies';

export function useProficienciesLoad (
    setProficiencies: Dispatch<SetStateAction<Proficiency[]>>
) {
    useEffect(() => {
        loadProficiencies(setProficiencies);
    }, [setProficiencies]);
}
