import type { Proficiency } from '../entities';
import type { ActivationPromptDetails } from '../controllers';

export interface IGetProficiencyPresenter {
    present (proficiency: Proficiency): ActivationPromptDetails;
}
