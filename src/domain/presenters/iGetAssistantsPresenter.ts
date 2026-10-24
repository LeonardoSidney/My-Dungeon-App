import type { Assistant } from '../entities';
import type { EntityOption } from '../controllers';

export interface IGetAssistantsPresenter {
    present (assistants: Assistant[]): EntityOption[];
}
