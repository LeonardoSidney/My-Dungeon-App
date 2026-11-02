import type { AdventureIndexEntry } from '@domain/entities';
import type { AdventureListItem } from '@domain/controllers';
import { IGetAdventuresPresenter } from '@domain/presenters';

export class GetAdventuresPresenter implements IGetAdventuresPresenter {
    present (entries: AdventureIndexEntry[]): AdventureListItem[] {
        return entries.map(entry => ({
            id: entry.id,
            name: entry.name,
            createdAt: new Date(entry.createdAt).toISOString(),
        }));
    }
}
