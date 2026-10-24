import type { Character } from '../entities';
import type { ActivationPromptListItem } from '../controllers';

export interface IGetCharactersPresenter {
    present (characters: Character[]): ActivationPromptListItem[];
}
