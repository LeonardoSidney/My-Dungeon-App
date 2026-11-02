import type { AdventureIndexEntry } from '../entities';
import type { AdventureListItem } from '../controllers';

export interface IGetAdventuresPresenter {
    present (entries: AdventureIndexEntry[]): AdventureListItem[];
}
