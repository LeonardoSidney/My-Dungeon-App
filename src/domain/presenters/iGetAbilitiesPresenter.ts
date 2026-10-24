import type { Ability } from '../entities';
import type { ActivationPromptListItem } from '../controllers';

export interface IGetAbilitiesPresenter {
    present (abilities: Ability[]): ActivationPromptListItem[];
}
