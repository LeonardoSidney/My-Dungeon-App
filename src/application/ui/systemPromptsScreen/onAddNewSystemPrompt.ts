import { setInitialSystemPromptState } from './setInitialSystemPromptState';
import { SystemPromptFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onAddNewSystemPrompt (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setSystemPromptFormData: Dispatch<SetStateAction<SystemPromptFormData>>,
) {
    setShowForm(true);
    setSystemPromptFormData(setInitialSystemPromptState());
}
