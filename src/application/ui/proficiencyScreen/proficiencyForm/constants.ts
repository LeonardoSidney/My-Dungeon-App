import { ProficiencyFormData } from '../constants';

export interface ProficiencyFormProps {
    showForm: boolean;
    proficiencyStateFormData: ProficiencyFormData;
    onChange: (field: keyof ProficiencyFormData, value: string | Date) => void;
    onCancel: () => void;
    onSave: () => Promise<void>;
}
