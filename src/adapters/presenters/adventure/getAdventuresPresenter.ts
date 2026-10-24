import type { Adventure } from '@domain/entities';
import type { AdventureListItem } from '@domain/controllers';
import { IGetAdventuresPresenter } from '@domain/presenters';

export class GetAdventuresPresenter implements IGetAdventuresPresenter {
    present (adventures: Adventure[]): AdventureListItem[] {
        return adventures.map(adventure => ({
            id: adventure.id,
            name: adventure.name,
            createdAt: new Date(adventure.createdAt).toISOString(),
        }));
    }
}
