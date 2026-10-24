import type { SystemPrompt } from '@domain/entities';
import type { SystemPromptDetails } from '@domain/controllers';
import { IGetSystemPromptPresenter } from '@domain/presenters';

export class GetSystemPromptPresenter implements IGetSystemPromptPresenter {
    present (systemPrompt: SystemPrompt): SystemPromptDetails {
        return {
            id: systemPrompt.id,
            name: systemPrompt.name,
            content: systemPrompt.content,
            observation: systemPrompt.observation,
        };
    }
}
