import type { Proficiency } from '../entities';
import type { ActivationPromptListItem } from '../controllers';

export interface IGetProficienciesPresenter {
    present (proficiencies: Proficiency[]): ActivationPromptListItem[];
}
