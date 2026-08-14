import { getSystemPromptsController } from '@infra/container';
import { Dispatch } from 'react';
import { SystemPrompt } from '@domain/entities';

export async function loadSystemPrompts (
    setSystemPrompts: Dispatch<React.SetStateAction<SystemPrompt[]>>
) {
    try {
        const ctrl = getSystemPromptsController();
        const result = await ctrl.handle();
        setSystemPrompts(result);
    } catch (error) {
        console.error('Failed to load system prompts:', error);
    }
}
