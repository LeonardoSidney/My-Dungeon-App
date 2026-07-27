import { Assistant, Ability, Proficiency, Status } from '@domain/entities';
import { CharacterFormData } from '../constants';

export type CharacterFormProps = {
    showForm: boolean;
    characterStateFormData: CharacterFormData;
    onChange: (field: keyof CharacterFormData, value: any) => void;
    onCancel: () => void;
    onSave: () => Promise<void>;
    assistants: Assistant[];
    abilities: Ability[];
    proficiencies: Proficiency[];
    statuses: Status[];
};
