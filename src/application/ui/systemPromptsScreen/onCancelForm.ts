import { setInitialSystemPromptState } from './setInitialSystemPromptState';
import { SystemPromptFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onCancelForm (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setSystemPromptFormData: Dispatch<SetStateAction<SystemPromptFormData>>,
) {
    setShowForm(false);
    setSystemPromptFormData(setInitialSystemPromptState());
}
