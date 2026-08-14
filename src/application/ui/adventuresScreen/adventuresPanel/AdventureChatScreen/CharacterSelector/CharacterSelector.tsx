import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { handleCharacterSelectFromList } from './handleCharacterSelectFromList';
import { useCharacterSelectorToggle } from './hooks/useCharacterSelectorToggle';
import { CharacterSelectorProps } from './constants';

export function CharacterSelector ({ adventure, onCharacterSelect, selectedCharacterId, style }: CharacterSelectorProps) {
  const { showList, setShowList, toggleList, dropdownArrow } = useCharacterSelectorToggle();

  const selectedCharacter = adventure.characters.find(c => c.id === selectedCharacterId) || adventure.characters[0];
  const isFirstItem = (index: number) => index === 0;
  const isLastItem = (index: number, total: number) => index === total - 1;
  const hasNextItem = (index: number, total: number) => index < total - 1;

  const isListVisible = showList;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleList}>
        <Text style={styles.dropdownText}>
          {dropdownArrow} {selectedCharacter.name}
        </Text>
      </TouchableOpacity>

      {isListVisible && (
        <View style={styles.dropdownList}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {adventure.characters.map((character, index) => {
              const totalCharacters = adventure.characters.length;
              const itemStyle = [
                styles.dropdownItem,
                hasNextItem(index, totalCharacters) && styles.dropdownItemWithBorder,
                isFirstItem(index) && styles.dropdownItemFirst,
                isLastItem(index, totalCharacters) && styles.dropdownItemLast,
              ];

              return (
                <TouchableOpacity
                  key={character.id}
                  style={itemStyle}
                  onPress={() => handleCharacterSelectFromList({ character, onCharacterSelect, setShowList })}
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
