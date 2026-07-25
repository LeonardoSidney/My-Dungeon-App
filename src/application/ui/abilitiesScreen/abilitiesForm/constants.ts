import { AbilityFormData } from '../constants';

export interface AbilityFormProps {
    showForm: boolean;
    abilityStateFormData: AbilityFormData;
    onChange: (field: keyof AbilityFormData, value: string | Date) => void;
    onCancel: () => void;
    onSave: () => Promise<void>;
}
