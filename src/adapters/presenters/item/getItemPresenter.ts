import type { Item } from '@domain/entities';
import type { ActivationPromptDetails } from '@domain/controllers';
import { IGetItemPresenter } from '@domain/presenters';

export class GetItemPresenter implements IGetItemPresenter {
    present (item: Item): ActivationPromptDetails {
        return {
            id: item.id,
            name: item.name,
            activationWord: item.activationWord,
            prompt: item.prompt,
            observation: item.observation,
        };
    }
}
