import type { Location } from '../entities';
import type { ActivationPromptDetails } from '../controllers';

export interface IGetLocationPresenter {
    present (location: Location): ActivationPromptDetails;
}
