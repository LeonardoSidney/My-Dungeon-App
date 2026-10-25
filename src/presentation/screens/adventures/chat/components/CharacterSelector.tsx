import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, type ViewStyle } from 'react-native';
import { AdventureChatCharacter } from '@domain/controllers';
import { styles } from './CharacterSelector.styles';

type CharacterSelectorProps = {
  characters: AdventureChatCharacter[];
  selectedCharacter: AdventureChatCharacter;
  onSelect: (character: AdventureChatCharacter) => void;
  style?: ViewStyle;
};

export function CharacterSelector ({ characters, selectedCharacter, onSelect, style }: CharacterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (character: AdventureChatCharacter) => {
    onSelect(character);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsOpen(open => !open)}>
        <Text style={styles.dropdownText}>
          {isOpen ? '▼' : '▲'} {selectedCharacter.name}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
            {characters.map((character, index) => {
              const isFirst = index === 0;
              const isLast = index === characters.length - 1;
              return (
                <TouchableOpacity
                  key={character.id}
                  style={[
                    styles.dropdownItem,
                    !isLast && styles.dropdownItemWithBorder,
                    isFirst && styles.dropdownItemFirst,
                    isLast && styles.dropdownItemLast,
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
