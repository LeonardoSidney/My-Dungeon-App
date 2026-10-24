import type { Status } from '../entities';
import type { ActivationPromptListItem } from '../controllers';

export interface IGetStatusesPresenter {
    present (statuses: Status[]): ActivationPromptListItem[];
}
