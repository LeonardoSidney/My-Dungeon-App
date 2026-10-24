import type { Assistant } from '@domain/entities';
import type { AssistantDetails } from '@domain/controllers';
import { IGetAssistantPresenter } from '@domain/presenters';

export class GetAssistantPresenter implements IGetAssistantPresenter {
    present (assistant: Assistant): AssistantDetails {
        return {
            id: assistant.id,
            name: assistant.name,
            observation: assistant.observation,
            modelId: assistant.modelId,
            samplerId: assistant.samplerId,
            connectionId: assistant.connectionId,
        };
    }
}
