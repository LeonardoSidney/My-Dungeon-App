import { AdventureChatCharacter } from '@domain/controllers';
import { ViewStyle } from 'react-native';
import { Dispatch, SetStateAction } from 'react';

export interface CharacterSelectorProps {
  characters: AdventureChatCharacter[];
  onCharacterSelect: (character: AdventureChatCharacter) => void;
  selectedCharacterId?: string;
  style?: ViewStyle;
}

export interface HandleCharacterSelectFromListParams {
  character: AdventureChatCharacter;
  onCharacterSelect: (character: AdventureChatCharacter) => void;
  setShowList: Dispatch<SetStateAction<boolean>>;
}
