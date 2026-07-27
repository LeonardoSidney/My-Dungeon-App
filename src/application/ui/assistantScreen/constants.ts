import { Model, Sampler } from '@domain/entities';

export type AssistantFormData = {
    id?: string;
    name: string;
    observation: string;
    model: Model | null;
    sampler: Sampler | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export function setInitialAssistantState (): AssistantFormData {
    return {
        id: undefined,
        name: '',
        observation: '',
        model: null,
        sampler: null,
    };
}
