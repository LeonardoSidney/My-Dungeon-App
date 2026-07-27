import { StatusFormData } from '../constants';

export type FormErrors = {
    name?: string;
    activationWord?: string;
    prompt?: string;
};

export interface StatusFormProps {
    showForm: boolean;
    statusStateFormData: StatusFormData;
    onChange: (field: keyof StatusFormData, value: string | Date) => void;
    onCancel: () => void;
    onSave: () => Promise<void>;
    formErrors: FormErrors;
}
