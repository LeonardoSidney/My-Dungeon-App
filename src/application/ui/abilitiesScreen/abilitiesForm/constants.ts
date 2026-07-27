import { AbilityFormData } from '../constants';

export type FormErrors = {
    name?: string;
    activationWorld?: string;
    prompt?: string;
};

export interface AbilityFormProps {
    showForm: boolean;
    abilityStateFormData: AbilityFormData;
    onChange: (field: keyof AbilityFormData, value: string | Date) => void;
    onCancel: () => void;
    onSave: () => Promise<void>;
    formErrors: FormErrors;
}
