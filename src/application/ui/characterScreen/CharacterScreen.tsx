import React, { useCallback, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Character, Assistant, Ability, Proficiency, Status } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, SelectField, SingleSelect, MultiSelect, useEntityScreenLoad } from '@application/ui/components';
import { useControllers } from '@adapters/ui/ControllersProvider';
import { CharacterFormData, FormErrors, characterFormConfig } from './constants';
import { setInitialCharacterState } from './setInitialCharacterState';
import { handleCharacterFormChange } from './handleCharacterFormChange';
import { loadCharacters } from './loadCharacters';
import { loadAssistants } from './loadAssistants';
import { loadAbilities } from './loadAbilities';
import { loadProficiencies } from './loadProficiencies';
import { loadStatuses } from './loadStatuses';
import { renderAttributesField } from './attributesFields';
import { onAddNewCharacter } from './onAddNewCharacter';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseCharacter } from './onEraseCharacter';
import { onSaveCharacter } from './onSaveCharacter';

export function CharacterScreen () {
  const { getCharacters, getAssistants, getAbilities, getProficiencies, getStatuses, createCharacter, editCharacter, eraseCharacter } = useControllers();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [characterStateFormData, setCharacterFormData] = useState<CharacterFormData>(setInitialCharacterState());
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [proficiencies, setProficiencies] = useState<Proficiency[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const loadCharacterList = useCallback(() => loadCharacters(getCharacters, setCharacters), [getCharacters, setCharacters]);
  const loadAssistantList = useCallback(() => loadAssistants(getAssistants, setAssistants), [getAssistants, setAssistants]);
  const loadAbilityList = useCallback(() => loadAbilities(getAbilities, setAbilities), [getAbilities, setAbilities]);
  const loadProficiencyList = useCallback(() => loadProficiencies(getProficiencies, setProficiencies), [getProficiencies, setProficiencies]);
  const loadStatusList = useCallback(() => loadStatuses(getStatuses, setStatuses), [getStatuses, setStatuses]);

  useEntityScreenLoad(loadCharacterList);
  useEntityScreenLoad(loadAssistantList);
  useEntityScreenLoad(loadAbilityList);
  useEntityScreenLoad(loadProficiencyList);
  useEntityScreenLoad(loadStatusList);

  const handleToggleItem = <T extends { id: string; }> (current: T[], item: T): T[] => {
    const isSelected = current.some(existing => existing.id === item.id);
    const filtered = current.filter(existing => existing.id !== item.id);
    return isSelected ? filtered : [...current, item];
  };

  const handleFormSave = async () => {
    const errors: FormErrors = {};
    if (!characterStateFormData.name.trim()) errors.name = 'Name is required';
    if (!characterStateFormData.activationWord.trim()) errors.activationWord = 'Activation Word is required';
    if (!characterStateFormData.assistant) errors.assistant = 'Assistant is required';
    if (!characterStateFormData.prompt.trim()) errors.prompt = 'Prompt is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    await onSaveCharacter(characterStateFormData, createCharacter, editCharacter, getCharacters, setCharacterFormData, setShowForm, setCharacters);
  };

  const handleFormChange = (field: keyof CharacterFormData, value: CharacterFormData[keyof CharacterFormData]) => {
    setFormErrors(prev => {
      const next = { ...prev };
      const errorField = field as keyof FormErrors;
      if (next[errorField]) {
        delete next[errorField];
      }
      return next;
    });
    handleCharacterFormChange(setCharacterFormData)(field, value);
  };

  const handleAddNewCharacter = () => {
    setFormErrors({});
    onAddNewCharacter(setShowForm, setCharacterFormData);
  };

  const handleEditCharacter = (character: Character) => {
    setFormErrors({});
    onEditForm(character, assistants, abilities, proficiencies, statuses, setShowForm, setCharacterFormData);
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Characters</Text>
        </View>

        <CrudEntityList
          items={characters}
          emptyText="No characters found."
          getDetailText={(character) => character.activationWord}
          onEdit={handleEditCharacter}
          onDelete={(character) => onEraseCharacter(character, eraseCharacter, getCharacters, setCharacters)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewCharacter}
        >
          <Text style={styles.addButtonText}>Add Character</Text>
        </TouchableOpacity>

        <ActivationPromptForm
          showForm={showForm}
          formData={characterStateFormData}
          config={characterFormConfig}
          singleSelect={
            <SelectField label="Assistant" error={formErrors.assistant}>
              <SingleSelect
                items={assistants}
                selectedId={characterStateFormData.assistant?.id}
                hasError={!!formErrors.assistant}
                emptyMessage="No assistants available"
                onSelect={(assistant: Assistant) => handleFormChange('assistant', assistant)}
              />
            </SelectField>
          }
          multiSelect={
            <>
              <SelectField label="Abilities">
                <MultiSelect
                  items={abilities}
                  selectedItems={characterStateFormData.abilities}
                  emptyMessage="No abilities available"
                  showTags
                  onToggle={(ability: Ability) => handleFormChange('abilities', handleToggleItem(characterStateFormData.abilities, ability))}
                />
              </SelectField>
              <SelectField label="Proficiencies">
                <MultiSelect
                  items={proficiencies}
                  selectedItems={characterStateFormData.proficiencies}
                  emptyMessage="No proficiencies available"
                  showTags
                  onToggle={(proficiency: Proficiency) => handleFormChange('proficiencies', handleToggleItem(characterStateFormData.proficiencies, proficiency))}
                />
              </SelectField>
              <SelectField label="Statuses">
                <MultiSelect
                  items={statuses}
                  selectedItems={characterStateFormData.statuses}
                  emptyMessage="No statuses available"
                  showTags
                  onToggle={(status: Status) => handleFormChange('statuses', handleToggleItem(characterStateFormData.statuses, status))}
                />
              </SelectField>
            </>
          }
          extraFields={renderAttributesField(
            characterStateFormData.attributes,
            (attributes) => handleFormChange('attributes', attributes)
          )}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setCharacterFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}
