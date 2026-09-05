import { SystemPrompt } from '@domain/entities';

export type FormErrors = {
    name?: string;
    content?: string;
};

export interface SystemPromptPanelProps {
    systemPrompts: SystemPrompt[];
    onEdit: (systemPrompt: SystemPrompt) => void;
    onDelete: (systemPrompt: SystemPrompt) => Promise<void>;
}

export type SystemPromptFormData = {
    id: string;
    name: string;
    content: string;
    observation: string;
};
