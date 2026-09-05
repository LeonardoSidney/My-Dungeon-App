import { Dispatch, SetStateAction } from 'react';
import { SystemPromptFormData } from './constants';

export function handleSystemPromptFormChange (
    setSystemPromptFormData: Dispatch<SetStateAction<SystemPromptFormData>>,
) {
    return (field: keyof SystemPromptFormData, value: string) => {
        setSystemPromptFormData((prev) => ({ ...prev, [field]: value }));
    };
}
