import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Character, Assistant, Ability, Proficiency, Status } from '@domain/entities';
import { styles } from './styles';
import { CharacterPanel } from './characterPanel';
import { CharacterForm } from './characterForm';
import { useCharactersLoad } from './useCharactersLoad';
import { useAssistantsLoad } from './useAssistantsLoad';
import { useAbilitiesLoad } from './useAbilitiesLoad';
import { useProficienciesLoad } from './useProficienciesLoad';
import { useStatusesLoad } from './useStatusesLoad';
import { CharacterFormData, FormErrors } from './constants';
import { setInitialCharacterState } from './setInitialCharacterState';
import { handleCharacterFormChange } from './handleCharacterFormChange';
import { onAddNewCharacter } from './onAddNewCharacter';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseCharacter } from './onEraseCharacter';
import { onSaveCharacter } from './onSaveCharacter';

export function CharacterScreen () {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [characterStateFormData, setCharacterFormData] = useState<CharacterFormData>(setInitialCharacterState());
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [proficiencies, setProficiencies] = useState<Proficiency[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useCharactersLoad(setCharacters);
  useAssistantsLoad(setAssistants);
  useAbilitiesLoad(setAbilities);
  useProficienciesLoad(setProficiencies);
  useStatusesLoad(setStatuses);

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

    await onSaveCharacter(characterStateFormData, setCharacterFormData, setShowForm, setCharacters);
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

        <CharacterPanel
          characters={characters}
          onEdit={(character: Character) => handleEditCharacter(character)}
          onDelete={(character: Character) => onEraseCharacter(character, setCharacters)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewCharacter}
        >
          <Text style={styles.addButtonText}>Add Character</Text>
        </TouchableOpacity>

        <CharacterForm
          showForm={showForm}
          characterStateFormData={characterStateFormData}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setCharacterFormData)}
          onSave={handleFormSave}
          assistants={assistants}
          abilities={abilities}
          proficiencies={proficiencies}
          statuses={statuses}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}
