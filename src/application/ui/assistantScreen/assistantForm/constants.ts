import { Model, Sampler } from '@domain/entities';
import { AssistantFormData } from '../constants';

export type FormErrors = {
    name?: string;
    model?: string;
    sampler?: string;
};

export type AssistantFormProps = {
    showForm: boolean;
    assistantStateFormData: AssistantFormData;
    onChange: (field: keyof AssistantFormData, value: AssistantFormData[keyof AssistantFormData]) => void;
    onCancel: () => void;
    onSave: () => void;
    models: Model[];
    samplers: Sampler[];
    formErrors: FormErrors;
};
