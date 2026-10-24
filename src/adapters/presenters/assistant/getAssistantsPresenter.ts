import type { Assistant } from '@domain/entities';
import type { EntityOption } from '@domain/controllers';
import { IGetAssistantsPresenter } from '@domain/presenters';

export class GetAssistantsPresenter implements IGetAssistantsPresenter {
    present (assistants: Assistant[]): EntityOption[] {
        return assistants.map(assistant => ({ id: assistant.id, name: assistant.name }));
    }
}
