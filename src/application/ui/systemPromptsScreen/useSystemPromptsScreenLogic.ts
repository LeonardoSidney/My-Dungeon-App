import { Dispatch, SetStateAction, useEffect } from 'react';
import { SystemPrompt } from '@domain/entities';
import { loadSystemPrompts } from './loadSystemPrompts';

export function useSystemPromptsScreenLogic (
    setSystemPrompts: Dispatch<SetStateAction<SystemPrompt[]>>
) {
    useEffect(() => {
        loadSystemPrompts(setSystemPrompts);
    }, [setSystemPrompts]);
}
