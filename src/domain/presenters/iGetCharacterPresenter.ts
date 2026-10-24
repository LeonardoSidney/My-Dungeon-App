import type { Character } from '../entities';
import type { CharacterDetails } from '../controllers';

export interface IGetCharacterPresenter {
    present (character: Character): CharacterDetails;
}
