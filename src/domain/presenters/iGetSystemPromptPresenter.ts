import type { SystemPrompt } from '../entities';
import type { SystemPromptDetails } from '../controllers';

export interface IGetSystemPromptPresenter {
    present (systemPrompt: SystemPrompt): SystemPromptDetails;
}
