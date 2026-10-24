import type { SystemPrompt } from '@domain/entities';
import type { SystemPromptListItem } from '@domain/controllers';
import { IGetSystemPromptsPresenter } from '@domain/presenters';

export class GetSystemPromptsPresenter implements IGetSystemPromptsPresenter {
    present (systemPrompts: SystemPrompt[]): SystemPromptListItem[] {
        return systemPrompts.map(systemPrompt => ({ id: systemPrompt.id, name: systemPrompt.name, content: systemPrompt.content }));
    }
}
