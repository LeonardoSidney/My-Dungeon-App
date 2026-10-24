import React from 'react';
import { View } from 'react-native';
import { ActivationPromptDetails, ActivationPromptListItem } from '@domain/controllers';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, type ActivationPromptFormData } from '@application/ui/components';
import { useEntityScreen } from '@application/ui/hooks';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { itemFormConfig } from './constants';
import { initialItemForm, submitItem, toFormState, validateItemForm } from './form';

export function ItemScreen () {
  const { getItems, getItem, createItem, editItem, eraseItem, alert } = useControllers();

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
    fetch: () => getItems.handle(),
    load: (id) => getItem.handle({ id }),
    submit: (itemForm) => submitItem(itemForm, createItem, editItem),
    erase: (id) => eraseItem.handle({ id }),
    toFormState,
    initialForm: initialItemForm,
    validate: validateItemForm,
    entityName: 'item',
    alert,
  });

  const renderForm = () => (
    <ActivationPromptForm
      showForm={showForm}
      formData={form}
      config={itemFormConfig}
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
        errorMessage="Failed to load items."
        emptyText="No items found."
        addLabel="Add Item"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={eraseEntity}
        getDetailText={(item) => item.activationWord}
        isFormOpen={showForm}
        renderForm={renderForm}
      />
    </View>
  );
}
