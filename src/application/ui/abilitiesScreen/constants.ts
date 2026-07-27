import { Ability } from '@domain/entities';

export type FormErrors = {
    name?: string;
    activationWorld?: string;
    prompt?: string;
};

export interface AbilityPanelProps {
    abilities: Ability[];
    onEdit: (ability: Ability) => void;
    onDelete: (ability: Ability) => Promise<void>;
}

export type AbilityFormData = {
    id: string;
    name: string;
    activationWorld: string;
    prompt: string;
    observation: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
};
