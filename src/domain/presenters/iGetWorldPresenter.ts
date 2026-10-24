import type { World } from '../entities';
import type { ActivationPromptDetails } from '../controllers';

export interface IGetWorldPresenter {
    present (world: World): ActivationPromptDetails;
}
