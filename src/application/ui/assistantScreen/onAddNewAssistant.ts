import { Dispatch, SetStateAction } from 'react';
import { AssistantFormData, setInitialAssistantState } from './constants';

export function onAddNewAssistant (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAssistantFormData: Dispatch<SetStateAction<AssistantFormData>>
) {
    setShowForm(true);
    setAssistantFormData(setInitialAssistantState());
}
