import type { Character } from '@domain/entities';
import type { ActivationPromptListItem } from '@domain/controllers';
import { IGetCharactersPresenter } from '@domain/presenters';

export class GetCharactersPresenter implements IGetCharactersPresenter {
    present (characters: Character[]): ActivationPromptListItem[] {
        return characters.map(character => ({
            id: character.id,
            name: character.name,
            activationWord: character.activationWord,
        }));
    }
}
