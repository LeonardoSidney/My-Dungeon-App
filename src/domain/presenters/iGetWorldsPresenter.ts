import type { World } from '../entities';
import type { ActivationPromptListItem } from '../controllers';

export interface IGetWorldsPresenter {
    present (worlds: World[]): ActivationPromptListItem[];
}
