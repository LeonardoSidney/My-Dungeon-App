import type { Item } from '../entities';
import type { ActivationPromptListItem } from '../controllers';

export interface IGetItemsPresenter {
    present (items: Item[]): ActivationPromptListItem[];
}
