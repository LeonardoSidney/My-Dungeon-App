import { SystemPromptViewData } from '@application/ui/adventuresScreen/onViewSystemPrompt';

export type SystemPromptViewerTab = 'systemPrompt' | 'finalPrompt';

export interface SystemPromptViewerProps {
    data: SystemPromptViewData;
    onBack: () => void;
}
