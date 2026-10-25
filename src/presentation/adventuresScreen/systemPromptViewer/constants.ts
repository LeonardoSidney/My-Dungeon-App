import {
    IGetAdventureSummaryController,
    IGetAdventureSystemPromptController,
    IGetAdventureTemplatedPromptController,
} from '@domain/controllers';

export type SystemPromptViewerTab = 'systemPrompt' | 'templatedPrompt';

export interface SystemPromptViewerControllers {
    getAdventureSummary: IGetAdventureSummaryController;
    getAdventureSystemPrompt: IGetAdventureSystemPromptController;
    getAdventureTemplatedPrompt: IGetAdventureTemplatedPromptController;
}

export interface SystemPromptViewerProps {
    adventureId: string;
    onBack: () => void;
    controllers: SystemPromptViewerControllers;
}

export type PromptState = {
    isLoading: boolean;
    prompt?: string;
    error?: string;
};
