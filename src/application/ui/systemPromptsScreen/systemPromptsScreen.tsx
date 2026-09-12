import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { SystemPromptForm } from './systemPromptForm';
import { CrudEntityList } from '@application/ui/components';
import { useEntityScreen } from '@application/ui/hooks';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { initialSystemPromptForm, submitSystemPrompt, toSystemPromptFormState, validateSystemPromptForm } from './form';

export function SystemPromptsScreen () {
  const { getSystemPrompts, createSystemPrompt, editSystemPrompt, eraseSystemPrompt } = useControllers();

  const {
    entities,
    isLoading,
    isError,
    form,
    updateField,
    showForm,
    openAdd,
    openEdit,
    closeForm,
    formErrors,
    save,
    eraseEntity,
  } = useEntityScreen({
    fetch: () => getSystemPrompts.handle(),
    submit: (systemPromptForm) => submitSystemPrompt(systemPromptForm, createSystemPrompt, editSystemPrompt),
    erase: (id) => eraseSystemPrompt.handle(id),
    toFormState: toSystemPromptFormState,
    initialForm: initialSystemPromptForm,
    validate: validateSystemPromptForm,
    entityName: 'system prompt',
  });

  const renderForm = () => (
    <SystemPromptForm
      showForm={showForm}
      systemPromptStateFormData={form}
      onChange={updateField}
      onCancel={closeForm}
      onSave={save}
      formErrors={formErrors}
    />
  );

  return (
    <View style={styles.container}>
      <CrudEntityList
        items={entities}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Failed to load system prompts."
        emptyText="No system prompts found."
        addLabel="Add System Prompt"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={eraseEntity}
        getDetailText={(systemPrompt) => systemPrompt.content}
        detailLines={1}
        isFormOpen={showForm}
        renderForm={renderForm}
      />
    </View>
  );
}
