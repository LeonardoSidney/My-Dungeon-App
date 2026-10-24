import type { Character } from '@domain/entities';
import type { CharacterDetails } from '@domain/controllers';
import { IGetCharacterPresenter } from '@domain/presenters';

export class GetCharacterPresenter implements IGetCharacterPresenter {
    present (character: Character): CharacterDetails {
        return {
            id: character.id,
            name: character.name,
            activationWord: character.activationWord,
            prompt: character.prompt,
            observation: character.observation,
            assistantId: character.assistantId,
            abilityIds: character.abilityIds ?? [],
            proficiencyIds: character.proficiencyIds ?? [],
            statusIds: character.statusIds ?? [],
            attributes: character.attributes ?? [],
        };
    }
}
