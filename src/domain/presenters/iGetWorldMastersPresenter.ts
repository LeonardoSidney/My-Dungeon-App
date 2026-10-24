import type { WorldMaster } from '../entities';
import type { ActivationPromptListItem } from '../controllers';

export interface IGetWorldMastersPresenter {
    present (worldMasters: WorldMaster[]): ActivationPromptListItem[];
}
