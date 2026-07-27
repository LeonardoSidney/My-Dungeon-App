import { ProficiencyFormData } from '../constants';

export type FormErrors = {
    name?: string;
    activationWord?: string;
    prompt?: string;
};

export interface ProficiencyFormProps {
    showForm: boolean;
    proficiencyStateFormData: ProficiencyFormData;
    onChange: (field: keyof ProficiencyFormData, value: string | Date) => void;
    onCancel: () => void;
    onSave: () => Promise<void>;
    formErrors: FormErrors;
}
