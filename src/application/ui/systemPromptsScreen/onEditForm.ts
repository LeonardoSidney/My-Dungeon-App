import { SystemPrompt } from '@domain/entities';
import { SystemPromptFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onEditForm (
    systemPrompt: SystemPrompt,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setSystemPromptFormData: Dispatch<SetStateAction<SystemPromptFormData>>,
) {
    setShowForm(true);
    setSystemPromptFormData({
        id: systemPrompt.id,
        name: systemPrompt.name,
        content: systemPrompt.content,
        observation: systemPrompt.observation ?? '',
    });
}
