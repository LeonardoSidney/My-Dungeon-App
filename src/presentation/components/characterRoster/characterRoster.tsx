import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { SelectListSection } from '../selectListSection';
import { CharacterRosterProps } from './constants';

export function CharacterRoster ({
  characters,
  worldMasters,
  selectedCharacters,
  aiCharacterIds,
  characterAsWorldMasterId,
  worldMaster,
  error,
  onToggleCharacter,
  onToggleAiCharacter,
  onCharacterAsWorldMaster,
  onWorldMaster,
}: CharacterRosterProps) {
  const isAvailable = (id: string) =>
    id !== characterAsWorldMasterId && !aiCharacterIds.includes(id);
  const filteredCharacters = characters.filter(character => isAvailable(character.id));
  const aiCandidates = characters.filter(character => character.id !== characterAsWorldMasterId);
  const aiSelected = characters.filter(character => aiCharacterIds.includes(character.id));

  return (
    <>
      <SelectListSection
        label="Characters"
        items={filteredCharacters}
        selectedItems={selectedCharacters}
        onToggle={onToggleCharacter}
        emptyText="No characters available"
        visibleSelectedItems={selectedCharacters.filter(character => isAvailable(character.id))}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}

      {characters.length > 0 && (
        <SelectListSection
          label="AI Controlled Characters"
          items={aiCandidates}
          selectedItems={aiSelected}
          onToggle={onToggleAiCharacter}
        />
      )}

      {!worldMaster && characters.length > 0 && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>No World Master Selected, Please Select a Character to Act as World Master</Text>
          <ScrollView style={styles.dropdown} nestedScrollEnabled>
            {characters.map(character => (
              <TouchableOpacity
                key={character.id}
                style={[
                  styles.dropdownOption,
                  characterAsWorldMasterId === character.id && styles.dropdownOptionSelected,
                ]}
                onPress={() => onCharacterAsWorldMaster(character)}
              >
                <Text style={styles.dropdownOptionText}>{character.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {worldMasters.length > 0 && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>World Master (optional)</Text>
          <ScrollView style={styles.dropdown} nestedScrollEnabled>
            {worldMasters.map(worldMasterItem => (
              <TouchableOpacity
                key={worldMasterItem.id}
                style={[
                  styles.dropdownOption,
                  worldMaster?.id === worldMasterItem.id && styles.dropdownOptionSelected,
                ]}
                onPress={() => onWorldMaster(worldMasterItem)}
              >
                <Text style={styles.dropdownOptionText}>{worldMasterItem.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
}
