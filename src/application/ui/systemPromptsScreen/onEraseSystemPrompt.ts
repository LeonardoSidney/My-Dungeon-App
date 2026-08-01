import { SystemPrompt } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { onErase } from './systemPromptForm/onErase';
import { loadSystemPrompts } from './loadSystemPrompts';

export async function onEraseSystemPrompt (
    systemPrompt: SystemPrompt,
    setSystemPrompts: Dispatch<SetStateAction<SystemPrompt[]>>
) {
    await onErase(systemPrompt.id);
    await loadSystemPrompts(setSystemPrompts);
}
