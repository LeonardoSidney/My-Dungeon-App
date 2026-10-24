import type { Ability } from '../entities';
import type { ActivationPromptDetails } from '../controllers';

export interface IGetAbilityPresenter {
    present (ability: Ability): ActivationPromptDetails;
}
