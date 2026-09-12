import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { colors } from '../../theme';
import { AdventuresFormProps } from './constants';
import { CharacterRoster, SelectListSection } from '@application/ui/components';
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
  optionErrors,
}: AdventuresFormProps) {
  const {
    characterAsWorldMasterId,
    formDataCharactersControlledByAi,
    formSelectedCharacters,
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

  const systemPromptsError = optionErrors.systemPrompts ? (
    <Text style={styles.errorText}>{optionErrors.systemPrompts}</Text>
  ) : (
    <SelectListSection
      label="System Prompts"
      items={systemPrompts}
      selectedItems={selectedSystemPrompts}
      onToggle={handleSystemPromptToggle}
      emptyText="No system prompts available"
    />
  );
  const rosterError = optionErrors.characters ?? optionErrors.worldMasters ?? formErrors.characters;
  const worldsErrorText = optionErrors.worlds ? <Text style={styles.errorText}>{optionErrors.worlds}</Text> : null;
  const worldsList = worlds.length > 0 ? (
    <SelectListSection
      label="Worlds (optional)"
      items={worlds}
      selectedItems={selectedWorlds ?? []}
      onToggle={handleWorldToggle}
    />
  ) : null;
  const locationsErrorText = optionErrors.locations ? <Text style={styles.errorText}>{optionErrors.locations}</Text> : null;
  const locationsList = locations.length > 0 ? (
    <SelectListSection
      label="Locations (optional)"
      items={locations}
      selectedItems={selectedLocations ?? []}
      onToggle={handleLocationToggle}
    />
  ) : null;
  const itemsErrorText = optionErrors.items ? <Text style={styles.errorText}>{optionErrors.items}</Text> : null;
  const itemsList = items.length > 0 ? (
    <SelectListSection
      label="Items (optional)"
      items={items}
      selectedItems={selectedItems ?? []}
      onToggle={handleItemToggle}
    />
  ) : null;

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
            placeholderTextColor={colors.placeholder}
            value={name}
            onChangeText={value => onChange('name', value)}
          />
          {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
        </View>

        {systemPromptsError}
        {formErrors.systemPrompts && <Text style={styles.errorText}>{formErrors.systemPrompts}</Text>}

        <CharacterRoster
          characters={characters}
          worldMasters={worldMasters}
          selectedCharacters={formSelectedCharacters}
          aiCharacterIds={formDataCharactersControlledByAi}
          characterAsWorldMasterId={characterAsWorldMasterId}
          worldMaster={worldMaster}
          error={rosterError}
          onToggleCharacter={handleCharacterToggle}
          onToggleAiCharacter={handleAiCharacterToggle}
          onCharacterAsWorldMaster={handleWorldMasterCharacterSelect}
          onWorldMaster={handleWorldMasterSelect}
        />

        {worldsErrorText}
        {worldsList}

        {locationsErrorText}
        {locationsList}

        {itemsErrorText}
        {itemsList}

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
