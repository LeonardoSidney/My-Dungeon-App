import { SystemPromptFormData } from '../constants';

export type FormErrors = {
    name?: string;
    content?: string;
};

export interface SystemPromptFormProps {
    showForm: boolean;
    systemPromptStateFormData: SystemPromptFormData;
    onChange: (field: keyof SystemPromptFormData, value: string) => void;
    onCancel: () => void;
    onSave: () => Promise<void>;
    formErrors: FormErrors;
}
