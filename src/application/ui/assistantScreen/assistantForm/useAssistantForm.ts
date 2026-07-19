import { useEffect, useState } from 'react';
import { Assistant } from '@domain/entities';

type FormState = {
    name: string;
    observation: string;
};

type UseAssistantFormReturn = {
    formState: FormState;
    loading: boolean;
    updateField: (field: keyof FormState, value: string) => void;
    setLoading: (loading: boolean) => void;
};

export function useAssistantForm (
    initialData?: Assistant | null
): UseAssistantFormReturn {
    const [formState, setFormState] = useState<FormState>({
        name: '',
        observation: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!initialData) {
            setFormState({
                name: '',
                observation: '',
            });
            return;
        }

        setFormState({
            name: initialData.name || '',
            observation: initialData.observation || '',
        });
    }, [initialData]);

    const updateField = (field: keyof FormState, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    return {
        formState,
        loading,
        updateField,
        setLoading,
    };
}
