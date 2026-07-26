import { Assistant } from '@domain/entities';

export type WorldMasterFormData = {
    id?: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation: string;
    assistant: Assistant | null;
};

export type WorldMasterFormProps = {
    showForm: boolean;
    worldMasterStateFormData: WorldMasterFormData;
    onChange: (field: keyof WorldMasterFormData, value: any) => void;
    onCancel: () => void;
    onSave: () => void;
    assistants: Assistant[];
};

export function setInitialWorldMasterState (): WorldMasterFormData {
    return {
        id: undefined,
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
        assistant: null,
    };
}
