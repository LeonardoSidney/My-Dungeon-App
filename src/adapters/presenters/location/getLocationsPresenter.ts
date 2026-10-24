import type { Location } from '@domain/entities';
import type { ActivationPromptListItem } from '@domain/controllers';
import { IGetLocationsPresenter } from '@domain/presenters';

export class GetLocationsPresenter implements IGetLocationsPresenter {
    present (locations: Location[]): ActivationPromptListItem[] {
        return locations.map(location => ({
            id: location.id,
            name: location.name,
            activationWord: location.activationWord,
        }));
    }
}
