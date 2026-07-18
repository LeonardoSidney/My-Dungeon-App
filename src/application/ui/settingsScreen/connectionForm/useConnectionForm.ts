import { useEffect, useState } from 'react';
import { Connection } from '@domain/entities';

type FormState = {
    name: string;
    ip: string;
    port: string;
    auth: string;
};

type UseConnectionFormReturn = {
    formState: FormState;
    loading: boolean;
    updateField: (field: keyof FormState, value: string) => void;
    setLoading: (loading: boolean) => void;
    getPortNumber: () => number | undefined;
};

export function useConnectionForm (initialData?: Connection | null): UseConnectionFormReturn {
    const [formState, setFormState] = useState<FormState>({
        name: '',
        ip: '',
        port: '',
        auth: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!initialData) return;
        setFormState({
            name: initialData.name,
            ip: initialData.ip,
            port: initialData.port?.toString() || '',
            auth: initialData.auth || '',
        });
    }, [initialData, loading]);

    const updateField = (field: keyof FormState, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const getPortNumber = () => {
        const portNumber = parseInt(formState.port, 10);
        if (isNaN(portNumber)) return undefined;
        return portNumber;
    };

    return {
        formState,
        loading,
        updateField,
        setLoading,
        getPortNumber,
    };
}
