import type { Location } from '../entities';
import type { ActivationPromptListItem } from '../controllers';

export interface IGetLocationsPresenter {
    present (locations: Location[]): ActivationPromptListItem[];
}
