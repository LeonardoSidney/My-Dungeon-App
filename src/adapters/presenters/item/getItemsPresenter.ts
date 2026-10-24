import type { Item } from '@domain/entities';
import type { ActivationPromptListItem } from '@domain/controllers';
import { IGetItemsPresenter } from '@domain/presenters';

export class GetItemsPresenter implements IGetItemsPresenter {
    present (items: Item[]): ActivationPromptListItem[] {
        return items.map(item => ({
            id: item.id,
            name: item.name,
            activationWord: item.activationWord,
        }));
    }
}
