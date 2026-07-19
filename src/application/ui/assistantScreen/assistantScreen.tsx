import React from 'react';
import { ScrollView, Text } from 'react-native';
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Assistants</Text>

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
  );
}
