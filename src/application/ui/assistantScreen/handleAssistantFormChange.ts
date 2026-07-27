import { Dispatch, SetStateAction } from 'react';
import '@domain/entities';
import { AssistantFormData } from './constants';

export function handleAssistantFormChange (
    setAssistantFormData: Dispatch<SetStateAction<AssistantFormData>>
) {
    return (field: keyof AssistantFormData, value: any) => {
        setAssistantFormData((prev) => ({ ...prev, [field]: value }));
    };
}
