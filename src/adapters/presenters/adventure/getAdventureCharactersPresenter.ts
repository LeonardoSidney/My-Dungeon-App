import type { Character } from '@domain/entities';
import type { AdventureChatCharacter } from '@domain/controllers';
import { IGetAdventureCharactersPresenter } from '@domain/presenters';

export class GetAdventureCharactersPresenter implements IGetAdventureCharactersPresenter {
    present (characters: Character[]): AdventureChatCharacter[] {
        return characters.map(character => ({ id: character.id, name: character.name }));
    }
}
