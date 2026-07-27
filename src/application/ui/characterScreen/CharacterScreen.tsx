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
import { CharacterFormData } from './constants';
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

  useCharactersLoad(setCharacters);
  useAssistantsLoad(setAssistants);
  useAbilitiesLoad(setAbilities);
  useProficienciesLoad(setProficiencies);
  useStatusesLoad(setStatuses);

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Characters</Text>
        </View>

        <CharacterPanel
          characters={characters}
          onEdit={(character: Character) => onEditForm(character, assistants, abilities, proficiencies, statuses, setShowForm, setCharacterFormData)}
          onDelete={(character: Character) => onEraseCharacter(character, setCharacters)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddNewCharacter(setShowForm, setCharacterFormData)}
        >
          <Text style={styles.addButtonText}>Add Character</Text>
        </TouchableOpacity>

        <CharacterForm
          showForm={showForm}
          characterStateFormData={characterStateFormData}
          onChange={handleCharacterFormChange(setCharacterFormData)}
          onCancel={() => onCancelForm(setShowForm, setCharacterFormData)}
          onSave={() => onSaveCharacter(characterStateFormData, setCharacterFormData, setShowForm, setCharacters)}
          assistants={assistants}
          abilities={abilities}
          proficiencies={proficiencies}
          statuses={statuses}
        />

      </ScrollView>
    </View>
  );
}
