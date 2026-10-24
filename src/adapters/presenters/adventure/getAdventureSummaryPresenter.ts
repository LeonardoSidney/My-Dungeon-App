import type { Adventure } from '@domain/entities';
import type { AdventureSummary } from '@domain/controllers';
import { IGetAdventureSummaryPresenter } from '@domain/presenters';

export class GetAdventureSummaryPresenter implements IGetAdventureSummaryPresenter {
    present (adventure: Adventure): AdventureSummary {
        return { id: adventure.id, name: adventure.name };
    }
}
