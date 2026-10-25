import React from 'react';
import { View } from 'react-native';
import { ActivationPromptDetails, ActivationPromptListItem } from '@domain/controllers';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, type ActivationPromptFormData } from '@presentation/components';
import { useEntityScreen } from '@presentation/hooks';
import { useControllers } from '@presentation/providers/controllersProvider';
import { abilityFormConfig } from './constants';
import { initialAbilityForm, submitAbility, toFormState, validateAbilityForm } from './form';

export function AbilitiesScreen () {
  const { getAbilities, getAbility, createAbility, editAbility, eraseAbility, alert } = useControllers();

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
    fetch: () => getAbilities.handle(),
    load: (id) => getAbility.handle({ id }),
    submit: (abilityForm) => submitAbility(abilityForm, createAbility, editAbility),
    erase: (id) => eraseAbility.handle({ id }),
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
