import { Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { styles } from './styles';
import { AdventuresFormProps } from './constants';
import { SelectListSection } from './selectListSection';
import { useAdventureFormLogic } from './useAdventureFormLogic';

export function AdventuresForm ({
  showForm,
  adventureStateFormData,
  onChange,
  onCancel,
  onSave,
  formErrors,
  characters,
  systemPrompts,
  worldMasters,
  worlds,
  locations,
  items,
}: AdventuresFormProps) {
  const {
    characterAsWorldMasterId,
    formDataCharactersControlledByAi,
    formSelectedCharacters,
    filteredCharacters,
    handleSystemPromptToggle,
    handleCharacterToggle,
    handleAiCharacterToggle,
    handleWorldMasterCharacterSelect,
    handleWorldMasterSelect,
    handleWorldToggle,
    handleLocationToggle,
    handleItemToggle,
  } = useAdventureFormLogic(adventureStateFormData, characters, onChange);

  const {
    name,
    systemPrompts: selectedSystemPrompts,
    worldMaster,
    worlds: selectedWorlds,
    locations: selectedLocations,
    items: selectedItems,
  } = adventureStateFormData;
  const isEditing = !!adventureStateFormData.id;

  if (!showForm) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>{isEditing ? 'Edit Adventure' : 'New Adventure'}</Text>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, formErrors.name && styles.inputError]}
            placeholder="e.g., The Lost Kingdom"
            placeholderTextColor="#666"
            value={name}
            onChangeText={value => onChange('name', value)}
          />
          {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
        </View>

        <SelectListSection
          label="System Prompts"
          items={systemPrompts}
          selectedItems={selectedSystemPrompts}
          onToggle={handleSystemPromptToggle}
          emptyText="No system prompts available"
        />
        {formErrors.systemPrompts && <Text style={styles.errorText}>{formErrors.systemPrompts}</Text>}

        <SelectListSection
          label="Characters"
          items={filteredCharacters}
          selectedItems={formSelectedCharacters}
          onToggle={handleCharacterToggle}
          emptyText="No characters available"
          visibleSelectedItems={formSelectedCharacters.filter(
            c => c.id !== characterAsWorldMasterId && !formDataCharactersControlledByAi.includes(c.id)
          )}
        />
        {formErrors.characters && <Text style={styles.errorText}>{formErrors.characters}</Text>}

        {characters.length > 0 && (
          <SelectListSection
            label="AI Controlled Characters"
            items={characters.filter(character => character.id !== characterAsWorldMasterId)}
            selectedItems={characters.filter(character => formDataCharactersControlledByAi.includes(character.id))}
            onToggle={handleAiCharacterToggle}
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
                  onPress={() => handleWorldMasterCharacterSelect(character)}
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
                  onPress={() => handleWorldMasterSelect(worldMasterItem)}
                >
                  <Text style={styles.dropdownOptionText}>{worldMasterItem.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {worlds.length > 0 && (
          <SelectListSection
            label="Worlds (optional)"
            items={worlds}
            selectedItems={selectedWorlds ?? []}
            onToggle={handleWorldToggle}
          />
        )}

        {locations.length > 0 && (
          <SelectListSection
            label="Locations (optional)"
            items={locations}
            selectedItems={selectedLocations ?? []}
            onToggle={handleLocationToggle}
          />
        )}

        {items.length > 0 && (
          <SelectListSection
            label="Items (optional)"
            items={items}
            selectedItems={selectedItems ?? []}
            onToggle={handleItemToggle}
          />
        )}

        <View style={styles.formActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>{isEditing ? 'Save' : 'Create'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
