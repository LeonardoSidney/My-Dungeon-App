import type { Location } from '@domain/entities';
import type { ActivationPromptDetails } from '@domain/controllers';
import { IGetLocationPresenter } from '@domain/presenters';

export class GetLocationPresenter implements IGetLocationPresenter {
    present (location: Location): ActivationPromptDetails {
        return {
            id: location.id,
            name: location.name,
            activationWord: location.activationWord,
            prompt: location.prompt,
            observation: location.observation,
        };
    }
}
