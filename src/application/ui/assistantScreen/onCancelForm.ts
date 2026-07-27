import { Dispatch, SetStateAction } from 'react';
import { AssistantFormData, setInitialAssistantState } from './constants';

export function onCancelForm (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAssistantFormData: Dispatch<SetStateAction<AssistantFormData>>
) {
    setShowForm(false);
    setAssistantFormData(setInitialAssistantState());
}
