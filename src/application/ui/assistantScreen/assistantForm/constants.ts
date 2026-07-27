import { Model, Sampler } from '@domain/entities';
import { AssistantFormData } from '../constants';

export type AssistantFormProps = {
    showForm: boolean;
    assistantStateFormData: AssistantFormData;
    onChange: (field: keyof AssistantFormData, value: any) => void;
    onCancel: () => void;
    onSave: () => void;
    models: Model[];
    samplers: Sampler[];
};
