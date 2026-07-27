import { World } from '@domain/entities';

export type WorldFormData = {
    id?: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation: string;
    createdAt?: Date;
};

export type WorldPanelProps = {
    worlds: World[];
    loading: boolean;
    onEdit: (world: World) => void;
    onDelete: (world: World) => void;
};

export type FormErrors = {
    name?: string;
    activationWord?: string;
    prompt?: string;
};

export type WorldFormProps = {
    showForm: boolean;
    worldStateFormData: WorldFormData;
    onChange: (field: keyof WorldFormData, value: string) => void;
    onCancel: () => void;
    onSave: () => void;
    formErrors: FormErrors;
};

export function setInitialWorldState (): WorldFormData {
    return {
        id: undefined,
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    };
}
