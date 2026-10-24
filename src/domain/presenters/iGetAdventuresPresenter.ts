import type { Adventure } from '../entities';
import type { AdventureListItem } from '../controllers';

export interface IGetAdventuresPresenter {
    present (adventures: Adventure[]): AdventureListItem[];
}
