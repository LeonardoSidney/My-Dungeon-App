import { useState } from 'react';

type FormState = {
    name: string;
    ip: string;
    port: string;
    auth: string;
};

type ValidationErrors = {
    name?: string;
    port?: string;
};

type UseFormValidationReturn = {
    errors: ValidationErrors;
    validate: (formState: FormState) => boolean;
};

export function useFormValidation (): UseFormValidationReturn {
    const [errors, setErrors] = useState<ValidationErrors>({});

    const validateName = (name: string): string | undefined => {
        if (!name.trim()) {
            return 'Name is required';
        }
        return undefined;
    };

    const validatePort = (port: string): string | undefined => {
        if (!port) {
            return undefined;
        }
        const portNumber = Number(port);
        if (isNaN(portNumber)) {
            return 'Port must be a number';
        }
        return undefined;
    };

    const validate = (formState: FormState): boolean => {
        const newErrors: ValidationErrors = {};

        const nameError = validateName(formState.name);
        nameError && (newErrors.name = nameError);

        const portError = validatePort(formState.port);
        portError && (newErrors.port = portError);

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return { errors, validate };
}
