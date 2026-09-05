import React, { useCallback, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Location } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, useEntityScreenLoad } from '@application/ui/components';
import { useControllers } from '@adapters/ui/ControllersProvider';
import { LocationFormData, FormErrors, locationFormConfig } from './constants';
import { setInitialLocationState } from './setInitialLocationState';
import { handleLocationFormChange } from './handleLocationFormChange';
import { loadLocations } from './loadLocations';
import { onAddNewLocation } from './onAddNewLocation';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseLocation } from './onEraseLocation';
import { onSaveLocation } from './onSaveLocation';

export function LocationScreen () {
  const { getLocations, createLocation, editLocation, eraseLocation } = useControllers();
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationStateFormData, setLocationFormData] = useState<LocationFormData>(setInitialLocationState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const loadEntities = useCallback(() => loadLocations(getLocations, setLocations), [getLocations, setLocations]);

  useEntityScreenLoad(loadEntities);

  const handleFormSave = async () => {
    const errors: FormErrors = {};
    if (!locationStateFormData.name.trim()) errors.name = 'Name is required';
    if (!locationStateFormData.activationWord.trim()) errors.activationWord = 'Activation Word is required';
    if (!locationStateFormData.prompt.trim()) errors.prompt = 'Prompt is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    await onSaveLocation(locationStateFormData, createLocation, editLocation, getLocations, setLocationFormData, setShowForm, setLocations);
  };

  const handleFormChange = (field: keyof LocationFormData, value: string) => {
    setFormErrors(prev => {
      const next = { ...prev };
      const errorField = field as keyof FormErrors;
      if (next[errorField]) {
        delete next[errorField];
      }
      return next;
    });
    handleLocationFormChange(setLocationFormData)(field, value);
  };

  const handleAddNewLocation = () => {
    setFormErrors({});
    onAddNewLocation(setShowForm, setLocationFormData);
  };

  const handleEditLocation = (location: Location) => {
    setFormErrors({});
    onEditForm(location, setShowForm, setLocationFormData);
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Locations</Text>
        </View>

        <CrudEntityList
          items={locations}
          emptyText="No locations found."
          getDetailText={(location) => location.activationWord}
          onEdit={handleEditLocation}
          onDelete={(location) => onEraseLocation(location, eraseLocation, getLocations, setLocations)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewLocation}
        >
          <Text style={styles.addButtonText}>Add Location</Text>
        </TouchableOpacity>

        <ActivationPromptForm
          showForm={showForm}
          formData={locationStateFormData}
          config={locationFormConfig}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setLocationFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}
