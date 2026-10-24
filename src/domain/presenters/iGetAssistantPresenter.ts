import type { Assistant } from '../entities';
import type { AssistantDetails } from '../controllers';

export interface IGetAssistantPresenter {
    present (assistant: Assistant): AssistantDetails;
}
