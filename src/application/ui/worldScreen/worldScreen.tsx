import React from 'react';
import { View } from 'react-native';
import { World } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, type ActivationPromptFormData } from '@application/ui/components';
import { useEntityScreen } from '@application/ui/hooks';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { worldFormConfig } from './constants';
import { initialWorldForm, submitWorld, toFormState, validateWorldForm } from './form';

export function WorldScreen () {
  const { getWorlds, createWorld, editWorld, eraseWorld, alert } = useControllers();

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
  } = useEntityScreen<World, ActivationPromptFormData>({
    fetch: () => getWorlds.handle(),
    submit: (worldForm) => submitWorld(worldForm, createWorld, editWorld),
    erase: (id) => eraseWorld.handle(id),
    toFormState,
    initialForm: initialWorldForm,
    validate: validateWorldForm,
    entityName: 'world',
    alert,
  });

  const renderForm = () => (
    <ActivationPromptForm
      showForm={showForm}
      formData={form}
      config={worldFormConfig}
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
        errorMessage="Failed to load worlds."
        emptyText="No worlds found."
        addLabel="Add World"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={eraseEntity}
        getDetailText={(world) => world.activationWord}
        isFormOpen={showForm}
        renderForm={renderForm}
      />
    </View>
  );
}
