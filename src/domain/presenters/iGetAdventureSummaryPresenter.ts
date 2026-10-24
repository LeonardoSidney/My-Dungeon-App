import type { Adventure } from '../entities';
import type { AdventureSummary } from '../controllers';

export interface IGetAdventureSummaryPresenter {
    present (adventure: Adventure): AdventureSummary;
}
