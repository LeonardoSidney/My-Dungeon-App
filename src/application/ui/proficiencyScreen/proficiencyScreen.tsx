import React from 'react';
import { View } from 'react-native';
import { Proficiency } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, type ActivationPromptFormData } from '@application/ui/components';
import { useEntityScreen } from '@application/ui/hooks';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { proficiencyFormConfig } from './constants';
import { initialProficiencyForm, submitProficiency, toFormState, validateProficiencyForm } from './form';

export function ProficiencyScreen () {
  const { getProficiencies, createProficiency, editProficiency, eraseProficiency } = useControllers();

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
  } = useEntityScreen<Proficiency, ActivationPromptFormData>({
    fetch: () => getProficiencies.handle(),
    submit: (proficiencyForm) => submitProficiency(proficiencyForm, createProficiency, editProficiency),
    erase: (id) => eraseProficiency.handle(id),
    toFormState,
    initialForm: initialProficiencyForm,
    validate: validateProficiencyForm,
    entityName: 'proficiency',
  });

  const renderForm = () => (
    <ActivationPromptForm
      showForm={showForm}
      formData={form}
      config={proficiencyFormConfig}
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
        errorMessage="Failed to load proficiencies."
        emptyText="No proficiencies found."
        addLabel="Add Proficiency"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={eraseEntity}
        getDetailText={(proficiency) => proficiency.activationWord}
        isFormOpen={showForm}
        renderForm={renderForm}
      />
    </View>
  );
}
