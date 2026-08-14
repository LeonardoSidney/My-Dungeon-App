import { ConnectionFormData } from './constants';

type ValidationErrors = {
    name?: string;
    ip?: string;
    port?: string;
};

export function validateConnectionForm (formData: ConnectionFormData): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
        errors.name = 'Name is required';
    }

    if (!formData.ip.trim()) {
        errors.ip = 'IP Address is required';
    }

    if (!formData.port.trim()) {
        errors.port = 'Port is required';
        return errors;
    }

    if (isNaN(Number(formData.port))) {
        errors.port = 'Port must be a number';
    }

    return errors;
}

export function hasValidationErrors (errors: ValidationErrors): boolean {
    return Object.keys(errors).length > 0;
}
