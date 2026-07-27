import { Dispatch, SetStateAction, useEffect } from 'react';
import { Assistant } from '@domain/entities';
import { loadAssistants } from './loadAssistants';

export function useAssistantsLoad (
    setAssistants: Dispatch<SetStateAction<Assistant[]>>
) {
    useEffect(() => {
        loadAssistants(setAssistants);
    }, [setAssistants]);
}
