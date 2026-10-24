import type { SystemPrompt } from '../entities';
import type { SystemPromptListItem } from '../controllers';

export interface IGetSystemPromptsPresenter {
    present (systemPrompts: SystemPrompt[]): SystemPromptListItem[];
}
