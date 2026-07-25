import { StatusFormData } from '../constants';

export interface StatusFormProps {
    showForm: boolean;
    statusStateFormData: StatusFormData;
    onChange: (field: keyof StatusFormData, value: string | Date) => void;
    onCancel: () => void;
    onSave: () => Promise<void>;
}
