import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './styles';
import { AdventuresFormProps } from './constants';
import { SelectList } from './selectList/SelectList';
import { Character, SystemPrompt, WorldMaster, World, Location, Item } from '@domain/entities';

function handleSystemPromptToggle (currentSystemPrompts: SystemPrompt[], systemPrompt: SystemPrompt): SystemPrompt[] {
  const isSystemPromptSelected = currentSystemPrompts.some((s) => s.id === systemPrompt.id);
  return isSystemPromptSelected
    ? currentSystemPrompts.filter((s) => s.id !== systemPrompt.id)
    : [...currentSystemPrompts, systemPrompt];
}

function handleCharacterToggle (currentCharacters: Character[], character: Character): Character[] {
  const isCharacterSelected = currentCharacters.some((c) => c.id === character.id);
  return isCharacterSelected
    ? currentCharacters.filter((c) => c.id !== character.id)
    : [...currentCharacters, character];
}

function handleWorldToggle (currentWorlds: World[], world: World): World[] {
  const isWorldSelected = currentWorlds.some((w) => w.id === world.id);
  return isWorldSelected
    ? currentWorlds.filter((w) => w.id !== world.id)
    : [...currentWorlds, world];
}

function handleLocationToggle (currentLocations: Location[], location: Location): Location[] {
  const isLocationSelected = currentLocations.some((l) => l.id === location.id);
  return isLocationSelected
    ? currentLocations.filter((l) => l.id !== location.id)
    : [...currentLocations, location];
}

function handleItemToggle (currentItems: Item[], item: Item): Item[] {
  const isItemSelected = currentItems.some((i) => i.id === item.id);
  return isItemSelected
    ? currentItems.filter((i) => i.id !== item.id)
    : [...currentItems, item];
}

function handleWorldMasterSelect (currentWorldMaster: WorldMaster | undefined, worldMaster: WorldMaster): WorldMaster | undefined {
  return currentWorldMaster?.id === worldMaster.id ? undefined : worldMaster;
}

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
  items
}: AdventuresFormProps) {
  const [_selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [characterAsWorldMaster, setCharacterAsWorldMaster] = useState<string | undefined>(adventureStateFormData.characterAsWorldMasterId);
  const [charactersControlledByAi, setCharactersControlledByAi] = useState<string[]>([]);
  const previousWorldMasterRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    setCharacterAsWorldMaster(adventureStateFormData.characterAsWorldMasterId);
  }, [adventureStateFormData.characterAsWorldMasterId]);

  const handleWorldMasterCharacterSelect = (selectedCharacter: Character) => {
    const newWorldMasterId = characterAsWorldMaster === selectedCharacter.id ? undefined : selectedCharacter.id;
    if (previousWorldMasterRef.current && previousWorldMasterRef.current !== newWorldMasterId) {
      setSelectedCharacters((prev) => prev.filter((c) => c.id !== previousWorldMasterRef.current));
      setCharactersControlledByAi((prev) => prev.filter((id) => id !== previousWorldMasterRef.current));
    }
    if (newWorldMasterId && formSelectedCharacters.some((c) => c.id === newWorldMasterId)) {
      onChange('characters', formSelectedCharacters.filter((c) => c.id !== newWorldMasterId));
    }
    setCharactersControlledByAi((prev) => prev.filter((id) => id !== selectedCharacter.id));
    setCharacterAsWorldMaster(newWorldMasterId);
    onChange('characterAsWorldMasterId', newWorldMasterId);
    previousWorldMasterRef.current = newWorldMasterId;
  };

  const handleAiCharacterToggle = (character: Character) => {
    const isCharacterSelected = charactersControlledByAi.includes(character.id);
    const newCharactersControlledByAi = isCharacterSelected
      ? charactersControlledByAi.filter((id) => id !== character.id)
      : [...charactersControlledByAi, character.id];
    if (!isCharacterSelected && formSelectedCharacters.some((c) => c.id === character.id)) {
      onChange('characters', formSelectedCharacters.filter((c) => c.id !== character.id));
    }
    setCharactersControlledByAi(newCharactersControlledByAi);
  };

  const filteredCharacters = characters.filter(
    (character) => character.id !== characterAsWorldMaster && !charactersControlledByAi.includes(character.id)
  );

  const {
    name,
    systemPrompts: selectedSystemPrompts,
    characters: formSelectedCharacters,
    worldMaster,
    worlds: selectedWorlds,
    locations: selectedLocations,
    items: selectedItems
  } = adventureStateFormData;
  const isEditing = !!adventureStateFormData.id;

  if (!showForm) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {isEditing ? 'Edit Adventure' : 'New Adventure'}
          </Text>
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
            onChangeText={(value) => onChange('name', value)}
          />
          {formErrors.name && (
            <Text style={styles.errorText}>{formErrors.name}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>System Prompts</Text>
          {systemPrompts.length > 0 ? (
            <>
              <SelectList
                items={systemPrompts}
                selectedItems={selectedSystemPrompts}
                onToggle={(systemPrompt) => onChange('systemPrompts', handleSystemPromptToggle(selectedSystemPrompts, systemPrompt))}
              />
              {selectedSystemPrompts.length > 0 && (
                <View style={styles.selectedTagsContainer}>
                  {selectedSystemPrompts.map((systemPrompt) => (
                    <TouchableOpacity
                      key={systemPrompt.id}
                      style={styles.selectedTag}
                      onPress={() => onChange('systemPrompts', handleSystemPromptToggle(selectedSystemPrompts, systemPrompt))}
                    >
                      <Text style={styles.selectedTagText}>{systemPrompt.name}</Text>
                      <Text style={styles.selectedTagRemove}>×</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          ) : (
            <Text style={styles.emptyDropdownText}>No system prompts available</Text>
          )}
          {formErrors.systemPrompts && (
            <Text style={styles.errorText}>{formErrors.systemPrompts}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Characters</Text>
          {characters.length > 0 ? (
            <>
              <SelectList
                items={filteredCharacters}
                selectedItems={formSelectedCharacters}
                onToggle={(character) => onChange('characters', handleCharacterToggle(formSelectedCharacters, character))}
              />
              {formSelectedCharacters.filter((c) => c.id !== characterAsWorldMaster && !charactersControlledByAi.includes(c.id)).length > 0 && (
                <View style={styles.selectedTagsContainer}>
                  {formSelectedCharacters.filter((c) => c.id !== characterAsWorldMaster && !charactersControlledByAi.includes(c.id)).map((character) => (
                    <TouchableOpacity
                      key={character.id}
                      style={styles.selectedTag}
                      onPress={() => onChange('characters', handleCharacterToggle(formSelectedCharacters, character))}
                    >
                      <Text style={styles.selectedTagText}>{character.name}</Text>
                      <Text style={styles.selectedTagRemove}>×</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          ) : (
            <Text style={styles.emptyDropdownText}>No characters available</Text>
          )}
          {formErrors.characters && (
            <Text style={styles.errorText}>{formErrors.characters}</Text>
          )}
        </View>

        {characters.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>AI Controlled Characters</Text>
            <SelectList
              items={characters.filter((character) => character.id !== characterAsWorldMaster)}
              selectedItems={characters.filter((character) => charactersControlledByAi.includes(character.id))}
              onToggle={(character) => handleAiCharacterToggle(character)}
            />
            {charactersControlledByAi.length > 0 && (
              <View style={styles.selectedTagsContainer}>
                {characters.filter((character) => charactersControlledByAi.includes(character.id)).map((character) => (
                  <TouchableOpacity
                    key={character.id}
                    style={styles.selectedTag}
                    onPress={() => handleAiCharacterToggle(character)}
                  >
                    <Text style={styles.selectedTagText}>{character.name}</Text>
                    <Text style={styles.selectedTagRemove}>×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {!worldMaster && characters.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>No World Master Selected, Please Select a Character to Act as World Master</Text>
            <View style={styles.dropdown}>
              {characters.map((character) => (
                <TouchableOpacity
                  key={character.id}
                  style={[
                    styles.dropdownOption,
                    characterAsWorldMaster === character.id && styles.dropdownOptionSelected
                  ]}
                  onPress={() => handleWorldMasterCharacterSelect(character)}
                >
                  <Text style={styles.dropdownOptionText}>{character.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {worldMasters.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>World Master (optional)</Text>
            <View style={styles.dropdown}>
              {worldMasters.map((worldMasterItem) => (
                <TouchableOpacity
                  key={worldMasterItem.id}
                  style={[
                    styles.dropdownOption,
                    worldMaster?.id === worldMasterItem.id && styles.dropdownOptionSelected
                  ]}
                  onPress={() => {
                    onChange('worldMaster', handleWorldMasterSelect(worldMaster, worldMasterItem));
                    onChange('characters', formSelectedCharacters.filter((c) => c.id !== characterAsWorldMaster));
                    setCharacterAsWorldMaster(undefined);
                    onChange('characterAsWorldMasterId', undefined);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{worldMasterItem.name}</Text>
                </TouchableOpacity>
              ))}
              {worldMasters.length === 0 && (
                <Text style={styles.emptyDropdownText}>No world masters available</Text>
              )}
            </View>
          </View>
        )}

        {worlds.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Worlds (optional)</Text>
            <SelectList
              items={worlds}
              selectedItems={selectedWorlds ?? []}
              onToggle={(world) => onChange('worlds', handleWorldToggle(selectedWorlds ?? [], world))}
            />
            {(selectedWorlds ?? []).length > 0 && (
              <View style={styles.selectedTagsContainer}>
                {(selectedWorlds ?? []).map((world) => (
                  <TouchableOpacity
                    key={world.id}
                    style={styles.selectedTag}
                    onPress={() => onChange('worlds', handleWorldToggle(selectedWorlds ?? [], world))}
                  >
                    <Text style={styles.selectedTagText}>{world.name}</Text>
                    <Text style={styles.selectedTagRemove}>×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {locations.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Locations (optional)</Text>
            <SelectList
              items={locations}
              selectedItems={selectedLocations ?? []}
              onToggle={(location) => onChange('locations', handleLocationToggle(selectedLocations ?? [], location))}
            />
            {(selectedLocations ?? []).length > 0 && (
              <View style={styles.selectedTagsContainer}>
                {(selectedLocations ?? []).map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    style={styles.selectedTag}
                    onPress={() => onChange('locations', handleLocationToggle(selectedLocations ?? [], location))}
                  >
                    <Text style={styles.selectedTagText}>{location.name}</Text>
                    <Text style={styles.selectedTagRemove}>×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {items.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Items (optional)</Text>
            <SelectList
              items={items}
              selectedItems={selectedItems ?? []}
              onToggle={(item) => onChange('items', handleItemToggle(selectedItems ?? [], item))}
            />
            {(selectedItems ?? []).length > 0 && (
              <View style={styles.selectedTagsContainer}>
                {(selectedItems ?? []).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.selectedTag}
                    onPress={() => onChange('items', handleItemToggle(selectedItems ?? [], item))}
                  >
                    <Text style={styles.selectedTagText}>{item.name}</Text>
                    <Text style={styles.selectedTagRemove}>×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
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
