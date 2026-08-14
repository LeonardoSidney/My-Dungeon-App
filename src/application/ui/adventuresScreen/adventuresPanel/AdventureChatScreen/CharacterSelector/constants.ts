import { Adventure, Character } from '@domain/entities';
import { ViewStyle } from 'react-native';
import { Dispatch, SetStateAction } from 'react';

export interface CharacterSelectorProps {
  adventure: Adventure;
  onCharacterSelect: (character: Character) => void;
  selectedCharacterId?: string;
  style?: ViewStyle;
}

export interface HandleCharacterSelectFromListParams {
  character: Character;
  onCharacterSelect: (character: Character) => void;
  setShowList: Dispatch<SetStateAction<boolean>>;
}
