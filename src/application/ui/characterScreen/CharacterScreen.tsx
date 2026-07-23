import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { styles } from './styles';
import { CharacterPanel } from './characterPanel';
import { CharacterForm } from './characterForm';
import { useCharacterScreenLogic } from './useCharacterScreenLogic';

export function CharacterScreen () {
  const {
    characters,
    assistants,
    abilities,
    proficiencies,
    statuses,
    selectedAssistant,
    setSelectedAssistant,
    loading,
    showForm,
    editingCharacter,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFormClose,
    handleFormSave,
  } = useCharacterScreenLogic();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Characters</Text>
          </View>

          <CharacterPanel
            characters={characters}
            loading={loading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <CharacterForm
            visible={showForm}
            onClose={handleFormClose}
            onSave={handleFormSave}
            initialData={editingCharacter}
            assistants={assistants}
            selectedAssistant={selectedAssistant}
            onAssistantChange={setSelectedAssistant}
            abilities={abilities}
            proficiencies={proficiencies}
            statuses={statuses}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
