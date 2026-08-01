import { SystemPrompt } from '@domain/entities';

export interface SystemPromptPanelProps {
    systemPrompts: SystemPrompt[];
    onEdit: (systemPrompt: SystemPrompt) => void;
    onDelete: (systemPrompt: SystemPrompt) => Promise<void>;
}
