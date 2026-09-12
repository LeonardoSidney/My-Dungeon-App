import React from 'react';
import { View } from 'react-native';
import { Location } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, type ActivationPromptFormData } from '@application/ui/components';
import { useEntityScreen } from '@application/ui/hooks';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { locationFormConfig } from './constants';
import { initialLocationForm, submitLocation, toFormState, validateLocationForm } from './form';

export function LocationScreen () {
  const { getLocations, createLocation, editLocation, eraseLocation } = useControllers();

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
  } = useEntityScreen<Location, ActivationPromptFormData>({
    fetch: () => getLocations.handle(),
    submit: (locationForm) => submitLocation(locationForm, createLocation, editLocation),
    erase: (id) => eraseLocation.handle(id),
    toFormState,
    initialForm: initialLocationForm,
    validate: validateLocationForm,
    entityName: 'location',
  });

  const renderForm = () => (
    <ActivationPromptForm
      showForm={showForm}
      formData={form}
      config={locationFormConfig}
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
        errorMessage="Failed to load locations."
        emptyText="No locations found."
        addLabel="Add Location"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={eraseEntity}
        getDetailText={(location) => location.activationWord}
        isFormOpen={showForm}
        renderForm={renderForm}
      />
    </View>
  );
}
