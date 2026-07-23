import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { styles } from './styles';
import { WorldMasterPanel } from './worldMasterPanel';
import { WorldMasterForm } from './worldMasterForm';
import { useWorldMasterScreenLogic } from './useWorldMasterScreenLogic';

export function WorldMasterScreen () {
  const {
    worldMasters,
    assistants,
    selectedAssistant,
    setSelectedAssistant,
    loading,
    showForm,
    editingWorldMaster,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFormClose,
    handleFormSave,
  } = useWorldMasterScreenLogic();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>World Masters</Text>
          </View>

          <WorldMasterPanel
            worldMasters={worldMasters}
            loading={loading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <WorldMasterForm
            visible={showForm}
            onClose={handleFormClose}
            onSave={handleFormSave}
            initialData={editingWorldMaster}
            assistants={assistants}
            selectedAssistant={selectedAssistant}
            onAssistantChange={setSelectedAssistant}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
