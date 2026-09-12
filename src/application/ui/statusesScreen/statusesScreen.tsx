import React from 'react';
import { View } from 'react-native';
import { Status } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, type ActivationPromptFormData } from '@application/ui/components';
import { useEntityScreen } from '@application/ui/hooks';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { statusFormConfig } from './constants';
import { initialStatusForm, submitStatus, toFormState, validateStatusForm } from './form';

export function StatusesScreen () {
  const { getStatuses, createStatus, editStatus, eraseStatus } = useControllers();

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
  } = useEntityScreen<Status, ActivationPromptFormData>({
    fetch: () => getStatuses.handle(),
    submit: (statusForm) => submitStatus(statusForm, createStatus, editStatus),
    erase: (id) => eraseStatus.handle(id),
    toFormState,
    initialForm: initialStatusForm,
    validate: validateStatusForm,
    entityName: 'status',
  });

  const renderForm = () => (
    <ActivationPromptForm
      showForm={showForm}
      formData={form}
      config={statusFormConfig}
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
        errorMessage="Failed to load statuses."
        emptyText="No statuses found."
        addLabel="Add Status"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={eraseEntity}
        getDetailText={(status) => status.activationWord}
        isFormOpen={showForm}
        renderForm={renderForm}
      />
    </View>
  );
}
