import { WorldFormData, FormErrors } from '../constants';

export interface WorldFormProps {
    showForm: boolean;
    worldStateFormData: WorldFormData;
    onChange: (field: keyof WorldFormData, value: string) => void;
    onCancel: () => void;
    onSave: () => void;
    formErrors: FormErrors;
}
