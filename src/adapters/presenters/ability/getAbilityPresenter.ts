import type { Ability } from '@domain/entities';
import type { ActivationPromptDetails } from '@domain/controllers';
import { IGetAbilityPresenter } from '@domain/presenters';

export class GetAbilityPresenter implements IGetAbilityPresenter {
    present (ability: Ability): ActivationPromptDetails {
        return {
            id: ability.id,
            name: ability.name,
            activationWord: ability.activationWord,
            prompt: ability.prompt,
            observation: ability.observation,
        };
    }
}
