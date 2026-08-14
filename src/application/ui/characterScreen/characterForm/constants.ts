import { Assistant, Ability, Proficiency, Status } from '@domain/entities';
import { CharacterFormData } from '../constants';

export type FormErrors = {
    name?: string;
    activationWord?: string;
    assistant?: string;
    prompt?: string;
};

export type CharacterFormProps = {
    showForm: boolean;
    characterStateFormData: CharacterFormData;
    onChange: (field: keyof CharacterFormData, value: CharacterFormData[keyof CharacterFormData]) => void;
    onCancel: () => void;
    onSave: () => Promise<void>;
    assistants: Assistant[];
    abilities: Ability[];
    proficiencies: Proficiency[];
    statuses: Status[];
    formErrors: FormErrors;
};
