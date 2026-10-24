import type { Proficiency } from '@domain/entities';
import type { ActivationPromptDetails } from '@domain/controllers';
import { IGetProficiencyPresenter } from '@domain/presenters';

export class GetProficiencyPresenter implements IGetProficiencyPresenter {
    present (proficiency: Proficiency): ActivationPromptDetails {
        return {
            id: proficiency.id,
            name: proficiency.name,
            activationWord: proficiency.activationWord,
            prompt: proficiency.prompt,
            observation: proficiency.observation,
        };
    }
}
