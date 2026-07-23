import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { styles } from './styles';
import { useAssistantScreenLogic } from './useAssistantScreenLogic';
import { AssistantPanel } from './assistantPanel/assistantPanel';
import { AssistantForm } from './assistantForm/assistantForm';

export function AssistantScreen () {
  const {
    assistants,
    models,
    samplers,
    loading,
    showForm,
    editingAssistant,
    selectedModel,
    setSelectedModel,
    selectedSampler,
    setSelectedSampler,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFormClose,
    handleFormSave,
  } = useAssistantScreenLogic();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Assistants</Text>
          </View>

          {loading && !assistants.length ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : !assistants.length ? (
            <Text style={styles.emptyText}>No assistants found. Add one!</Text>
          ) : (
            <AssistantPanel
              assistants={assistants}
              loading={loading}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          <AssistantForm
            visible={showForm}
            onClose={handleFormClose}
            onSave={handleFormSave}
            initialData={editingAssistant}
            models={models}
            samplers={samplers}
            selectedModel={selectedModel}
            selectedSampler={selectedSampler}
            onModelChange={setSelectedModel}
            onSamplerChange={setSelectedSampler}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
