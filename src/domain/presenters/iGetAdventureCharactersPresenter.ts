import type { Character } from '../entities';
import type { AdventureChatCharacter } from '../controllers';

export interface IGetAdventureCharactersPresenter {
    present (characters: Character[]): AdventureChatCharacter[];
}
