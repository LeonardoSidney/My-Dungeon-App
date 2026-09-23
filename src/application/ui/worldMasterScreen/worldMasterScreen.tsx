import React from 'react';
import { Text, View } from 'react-native';
import { Assistant, WorldMaster } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, SelectField, SingleSelect } from '@application/ui/components';
import { useEntityList, useEntityScreen } from '@application/ui/hooks';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { WorldMasterFormData, worldMasterFormConfig } from './constants';
import { initialWorldMasterForm, submitWorldMaster, toWorldMasterFormState, validateWorldMasterForm } from './form';

export function WorldMasterScreen () {
  const { getWorldMasters, getAssistants, createWorldMaster, editWorldMaster, eraseWorldMaster, alert } = useControllers();
  const assistants = useEntityList({ fetch: () => getAssistants.handle() });

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
  } = useEntityScreen<WorldMaster, WorldMasterFormData>({
    fetch: () => getWorldMasters.handle(),
    submit: (worldMasterForm) => submitWorldMaster(worldMasterForm, createWorldMaster, editWorldMaster),
    erase: (id) => eraseWorldMaster.handle(id),
    toFormState: (worldMaster) => toWorldMasterFormState(worldMaster, assistants.items),
    initialForm: initialWorldMasterForm,
    validate: validateWorldMasterForm,
    entityName: 'world master',
    alert,
  });

  const renderForm = () => (
    <ActivationPromptForm
      showForm={showForm}
      formData={form}
      config={worldMasterFormConfig}
      singleSelect={
        assistants.isError ? (
          <Text style={styles.errorText}>Failed to load assistants.</Text>
        ) : (
          <SelectField label="Assistant" error={formErrors.assistant}>
            <SingleSelect
              items={assistants.items}
              selectedId={form.assistant?.id}
              hasError={!!formErrors.assistant}
              emptyMessage="No assistants available"
              onSelect={(assistant: Assistant) => updateField('assistant', assistant)}
            />
          </SelectField>
        )
      }
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
        errorMessage="Failed to load world masters."
        emptyText="No world masters found."
        addLabel="Add World Master"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={eraseEntity}
        getDetailText={(worldMaster) => worldMaster.activationWord}
        isFormOpen={showForm}
        renderForm={renderForm}
      />
    </View>
  );
}
