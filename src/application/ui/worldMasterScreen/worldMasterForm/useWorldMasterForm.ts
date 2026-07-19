import { useEffect, useState } from 'react';
import { WorldMaster, Assistant } from '@domain/entities';

type FormState = {
    name: string;
    activationWord: string;
    prompt: string;
    observation: string;
};

type UseWorldMasterFormReturn = {
    formState: FormState;
    selectedAssistant: Assistant | null;
    loading: boolean;
    updateField: (field: keyof FormState, value: string) => void;
    setSelectedAssistant: (assistant: Assistant | null) => void;
    setLoading: (loading: boolean) => void;
};

export function useWorldMasterForm (
    initialData?: WorldMaster | null,
    existingAssistant?: Assistant | null
): UseWorldMasterFormReturn {
    const [formState, setFormState] = useState<FormState>({
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    });

    const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(existingAssistant || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!initialData) {
            setFormState({
                name: '',
                activationWord: '',
                prompt: '',
                observation: '',
            });
            return;
        }

        setFormState({
            name: initialData.name || '',
            activationWord: initialData.activationWord || '',
            prompt: initialData.prompt || '',
            observation: initialData.observation || '',
        });
    }, [initialData]);

    const updateField = (field: keyof FormState, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    return {
        formState,
        selectedAssistant,
        loading,
        updateField,
        setSelectedAssistant,
        setLoading,
    };
}
