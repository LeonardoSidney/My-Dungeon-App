import type { Proficiency } from '@domain/entities';
import type { ActivationPromptListItem } from '@domain/controllers';
import { IGetProficienciesPresenter } from '@domain/presenters';

export class GetProficienciesPresenter implements IGetProficienciesPresenter {
    present (proficiencies: Proficiency[]): ActivationPromptListItem[] {
        return proficiencies.map(proficiency => ({
            id: proficiency.id,
            name: proficiency.name,
            activationWord: proficiency.activationWord,
        }));
    }
}
