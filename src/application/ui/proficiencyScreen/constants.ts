import { Proficiency } from '@domain/entities';

export interface ProficiencyPanelProps {
    proficiencies: Proficiency[];
    onEdit: (proficiency: Proficiency) => void;
    onDelete: (proficiency: Proficiency) => Promise<void>;
}

export type ProficiencyFormData = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
};
