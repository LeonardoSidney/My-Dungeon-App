import { ConnectionFormData } from './constants';

type ValidationErrors = {
    name?: string;
    port?: string;
};

export function validateConnectionForm (formData: ConnectionFormData): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
        errors.name = 'Name is required';
    }

    if (formData.port && isNaN(Number(formData.port))) {
        errors.port = 'Port must be a number';
    }

    return errors;
}

export function hasValidationErrors (errors: ValidationErrors): boolean {
    return Object.keys(errors).length > 0;
}
