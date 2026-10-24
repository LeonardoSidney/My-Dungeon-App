import type { Status } from '../entities';
import type { ActivationPromptDetails } from '../controllers';

export interface IGetStatusPresenter {
    present (status: Status): ActivationPromptDetails;
}
