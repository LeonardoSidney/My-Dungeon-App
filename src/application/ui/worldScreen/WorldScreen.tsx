import React, { useCallback, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { World } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, useEntityScreenLoad } from '@application/ui/components';
import { useControllers } from '@adapters/ui/ControllersProvider';
import { WorldFormData, FormErrors, setInitialWorldState, worldFormConfig } from './constants';
import { handleWorldFormChange } from './handleWorldFormChange';
import { loadWorlds } from './loadWorlds';
import { onAddNewWorld } from './onAddNewWorld';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseWorld } from './onEraseWorld';
import { onSaveWorld } from './onSaveWorld';

export function WorldScreen () {
  const { getWorlds, createWorld, editWorld, eraseWorld } = useControllers();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [worldStateFormData, setWorldFormData] = useState<WorldFormData>(setInitialWorldState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const loadEntities = useCallback(() => loadWorlds(getWorlds, setWorlds), [getWorlds, setWorlds]);

  useEntityScreenLoad(loadEntities);

  const handleFormSave = async () => {
    const errors: FormErrors = {};
    if (!worldStateFormData.name.trim()) errors.name = 'Name is required';
    if (!worldStateFormData.activationWord.trim()) errors.activationWord = 'Activation Word is required';
    if (!worldStateFormData.prompt.trim()) errors.prompt = 'Prompt is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    await onSaveWorld(worldStateFormData, createWorld, editWorld, getWorlds, setWorldFormData, setShowForm, setWorlds);
  };

  const handleFormChange = (field: keyof WorldFormData, value: string) => {
    setFormErrors(prev => {
      const next = { ...prev };
      const errorField = field as keyof FormErrors;
      if (next[errorField]) {
        delete next[errorField];
      }
      return next;
    });
    handleWorldFormChange(setWorldFormData)(field, value);
  };

  const handleAddNewWorld = () => {
    setFormErrors({});
    onAddNewWorld(setShowForm, setWorldFormData);
  };

  const handleEditWorld = (world: World) => {
    setFormErrors({});
    onEditForm(world, setShowForm, setWorldFormData);
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Worlds</Text>
        </View>

        <CrudEntityList
          items={worlds}
          emptyText="No worlds found."
          getDetailText={(world) => world.activationWord}
          onEdit={handleEditWorld}
          onDelete={(world) => onEraseWorld(world, eraseWorld, getWorlds, setWorlds)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewWorld}
        >
          <Text style={styles.addButtonText}>Add World</Text>
        </TouchableOpacity>

        <ActivationPromptForm
          showForm={showForm}
          formData={worldStateFormData}
          config={worldFormConfig}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setWorldFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}
