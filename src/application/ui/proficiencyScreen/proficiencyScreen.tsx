import React from 'react';
import { View } from 'react-native';
import { ActivationPromptDetails, ActivationPromptListItem } from '@domain/controllers';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, type ActivationPromptFormData } from '@application/ui/components';
import { useEntityScreen } from '@application/ui/hooks';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { proficiencyFormConfig } from './constants';
import { initialProficiencyForm, submitProficiency, toFormState, validateProficiencyForm } from './form';

export function ProficiencyScreen () {
  const { getProficiencies, getProficiency, createProficiency, editProficiency, eraseProficiency, alert } = useControllers();

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
  } = useEntityScreen<ActivationPromptListItem, ActivationPromptFormData, ActivationPromptDetails>({
    fetch: () => getProficiencies.handle(),
    load: (id) => getProficiency.handle({ id }),
    submit: (proficiencyForm) => submitProficiency(proficiencyForm, createProficiency, editProficiency),
    erase: (id) => eraseProficiency.handle({ id }),
    toFormState,
    initialForm: initialProficiencyForm,
    validate: validateProficiencyForm,
    entityName: 'proficiency',
    alert,
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
