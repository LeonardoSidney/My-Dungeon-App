import type { Adventure } from '../entities';
import type { AdventureDetails } from '../controllers';

export interface IGetAdventurePresenter {
    present (adventure: Adventure): AdventureDetails;
}
