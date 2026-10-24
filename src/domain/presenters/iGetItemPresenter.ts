import type { Item } from '../entities';
import type { ActivationPromptDetails } from '../controllers';

export interface IGetItemPresenter {
    present (item: Item): ActivationPromptDetails;
}
