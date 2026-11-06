import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, type ViewStyle } from 'react-native';
import { AdventureChatCharacter } from '@domain/controllers';
import { getShortCharacterName } from '../chatActions';
import { styles } from './CharacterSelector.styles';

type CharacterSelectorProps = {
  characters: AdventureChatCharacter[];
  selectedCharacter: AdventureChatCharacter;
  onSelect: (character: AdventureChatCharacter) => void;
  isCompact: boolean;
  style?: ViewStyle;
};

export function CharacterSelector ({ characters, selectedCharacter, onSelect, isCompact, style }: CharacterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrow = isOpen ? '▼' : '▲';
  const shortName = getShortCharacterName(selectedCharacter, characters);
  const buttonLabel = isCompact ? arrow : `${arrow} ${shortName}`;

  const handleSelect = (character: AdventureChatCharacter) => {
    onSelect(character);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.dropdownButton, isCompact && styles.dropdownButtonCompact]}
        onPress={() => setIsOpen(open => !open)}
        accessibilityLabel={`Personagem: ${selectedCharacter.name}`}
      >
        <Text style={styles.dropdownText}>{buttonLabel}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
            {characters.map((character, index) => {
              const isFirst = index === 0;
              const isLast = index === characters.length - 1;
              const isSelected = character.id === selectedCharacter.id;
              return (
                <TouchableOpacity
                  key={character.id}
                  style={[
                    styles.dropdownItem,
                    !isLast && styles.dropdownItemWithBorder,
                    isFirst && styles.dropdownItemFirst,
                    isLast && styles.dropdownItemLast,
                    isSelected && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleSelect(character)}
                >
                  <Text style={styles.itemText}>{character.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
