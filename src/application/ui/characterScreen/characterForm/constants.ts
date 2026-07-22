import { Assistant, Character, Ability, Proficiency, Status, Attribute } from '@domain/entities';
import { CharacterFormData } from '../constants';

export type CharacterFormProps = {
    visible: boolean;
    onClose: () => void;
    onSave: (character: CharacterFormData) => void;
    initialData?: Character | null;
    assistants: Assistant[];
    selectedAssistant: Assistant | null;
    onAssistantChange: (assistant: Assistant | null) => void;
    abilities: Ability[];
    proficiencies: Proficiency[];
    statuses: Status[];
};

export type UseCharacterSaveParams = {
    onSave: (character: CharacterFormData) => void;
    onClose: () => void;
    setLoading: (loading: boolean) => void;
};

export type FormState = {
    name: string;
    activationWord: string;
    prompt: string;
    observation: string;
};

export type UseCharacterFormReturn = {
    formState: FormState;
    loading: boolean;
    updateField: (field: keyof FormState, value: string) => void;
    setLoading: (loading: boolean) => void;
    selectedAbilities: Ability[];
    selectedProficiencies: Proficiency[];
    selectedStatuses: Status[];
    toggleAbility: (ability: Ability) => void;
    toggleProficiency: (proficiency: Proficiency) => void;
    toggleStatus: (status: Status) => void;
    attributes: Attribute[];
    addAttribute: () => void;
    removeAttribute: (index: number) => void;
    updateAttribute: (index: number, field: 'name' | 'value', value: string) => void;
};
