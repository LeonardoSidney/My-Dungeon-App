import { Text, TouchableOpacity, View } from 'react-native';
import { Character, Adventure } from '@domain/entities';
import { useState } from 'react';
import { styles } from './styles';

export function CharacterSelector({
  adventure,
  onCharacterSelect,
  selectedCharacterId,
  style,
}: {
  adventure: Adventure;
  onCharacterSelect: (character: Character) => void;
  selectedCharacterId?: string;
  style?: any;
}) {
  const [showList, setShowList] = useState(false);

  function handleCharacterSelect(character: Character) {
    onCharacterSelect(character);
    setShowList(false);
  }

  function getSelectedCharacter() {
    return adventure.characters.find(c => c.id === selectedCharacterId) || adventure.characters[0];
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowList(!showList)}>
        <Text style={styles.dropdownText}>
          {showList ? '▼' : '▲'} {getSelectedCharacter().name}
        </Text>
      </TouchableOpacity>

      {showList && (
        <View style={styles.dropdownList}>
          {adventure.characters.map((character, index) => (
            <TouchableOpacity
              key={character.id}
              style={[
                styles.dropdownItem,
                index < adventure.characters.length - 1 && styles.dropdownItemWithBorder,
                index === 0 && styles.dropdownItemFirst,
                index === adventure.characters.length - 1 && styles.dropdownItemLast,
              ]}
              onPress={() => handleCharacterSelect(character)}
            >
              <Text style={styles.itemText}>{character.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
