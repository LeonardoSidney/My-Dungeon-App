import { SystemPromptFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { onSubmit } from './systemPromptForm/onSubmit';
import { setInitialSystemPromptState } from './setInitialSystemPromptState';
import { loadSystemPrompts } from './loadSystemPrompts';
import { SystemPrompt } from '@domain/entities';

export async function onSaveSystemPrompt (
    formData: SystemPromptFormData,
    setSystemPromptFormData: Dispatch<SetStateAction<SystemPromptFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setSystemPrompts: Dispatch<SetStateAction<SystemPrompt[]>>
) {
    const response = await onSubmit(formData);
    if (!response || !response.success) return;

    setSystemPromptFormData(setInitialSystemPromptState());
    setShowForm(false);
    await loadSystemPrompts(setSystemPrompts);
}
