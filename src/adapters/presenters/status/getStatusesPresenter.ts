import type { Status } from '@domain/entities';
import type { ActivationPromptListItem } from '@domain/controllers';
import { IGetStatusesPresenter } from '@domain/presenters';

export class GetStatusesPresenter implements IGetStatusesPresenter {
    present (statuses: Status[]): ActivationPromptListItem[] {
        return statuses.map(status => ({
            id: status.id,
            name: status.name,
            activationWord: status.activationWord,
        }));
    }
}
