import type { Ability } from '@domain/entities';
import type { ActivationPromptListItem } from '@domain/controllers';
import { IGetAbilitiesPresenter } from '@domain/presenters';

export class GetAbilitiesPresenter implements IGetAbilitiesPresenter {
    present (abilities: Ability[]): ActivationPromptListItem[] {
        return abilities.map(ability => ({
            id: ability.id,
            name: ability.name,
            activationWord: ability.activationWord,
        }));
    }
}
