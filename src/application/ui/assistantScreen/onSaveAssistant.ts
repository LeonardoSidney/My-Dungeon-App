import { Dispatch, SetStateAction } from 'react';
import { Assistant } from '@domain/entities';
import { loadAssistants } from './loadAssistants';
import { onSubmit } from './assistantForm/onSubmit';
import { AssistantFormData, setInitialAssistantState } from './constants';

export async function onSaveAssistant (
    assistantStateFormData: AssistantFormData,
    setAssistantFormData: Dispatch<SetStateAction<AssistantFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setAssistants: Dispatch<SetStateAction<Assistant[]>>
) {
    if (!assistantStateFormData.name.trim()) return;
    if (!assistantStateFormData.model) return;
    if (!assistantStateFormData.sampler) return;

    try {
        await onSubmit(assistantStateFormData);
        setAssistantFormData(setInitialAssistantState());
        setShowForm(false);
        await loadAssistants(setAssistants);
    } catch (error) {
        console.error('Failed to save assistant:', error);
    }
}
