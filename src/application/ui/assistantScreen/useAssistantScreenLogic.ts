import { useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Assistant } from '@domain/entities';
import { loadAssistants } from './loadAssistants';

export function useAssistantScreenLogic (
    setAssistants: Dispatch<SetStateAction<Assistant[]>>
) {
    useEffect(() => {
        loadAssistants(setAssistants);
    }, [setAssistants]);
}
