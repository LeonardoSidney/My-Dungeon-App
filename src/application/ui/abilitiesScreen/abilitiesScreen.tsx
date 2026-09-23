import React from 'react';
import { View } from 'react-native';
import { Ability } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, type ActivationPromptFormData } from '@application/ui/components';
import { useEntityScreen } from '@application/ui/hooks';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { abilityFormConfig } from './constants';
import { initialAbilityForm, submitAbility, toFormState, validateAbilityForm } from './form';

export function AbilitiesScreen () {
  const { getAbilities, createAbility, editAbility, eraseAbility, alert } = useControllers();

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
  } = useEntityScreen<Ability, ActivationPromptFormData>({
    fetch: () => getAbilities.handle(),
    submit: (abilityForm) => submitAbility(abilityForm, createAbility, editAbility),
    erase: (id) => eraseAbility.handle(id),
    toFormState,
    initialForm: initialAbilityForm,
    validate: validateAbilityForm,
    entityName: 'ability',
    alert,
  });

  const renderForm = () => (
    <ActivationPromptForm
      showForm={showForm}
      formData={form}
      config={abilityFormConfig}
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
        errorMessage="Failed to load abilities."
        emptyText="No abilities found."
        addLabel="Add Ability"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={eraseEntity}
        getDetailText={(ability) => ability.activationWord}
        isFormOpen={showForm}
        renderForm={renderForm}
      />
    </View>
  );
}
