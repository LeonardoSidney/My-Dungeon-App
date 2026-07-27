import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { World } from '@domain/entities';
import { styles } from './styles';
import { WorldPanel } from './worldPanel';
import { WorldForm } from './worldForm';
import { useWorldScreenLogic } from './useWorldScreenLogic';
import { WorldFormData } from './constants';
import { setInitialWorldState } from './constants';
import { handleWorldFormChange } from './handleWorldFormChange';
import { onAddNewWorld } from './onAddNewWorld';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseWorld } from './onEraseWorld';
import { onSaveWorld } from './onSaveWorld';

type FormErrors = {
  name?: string;
  activationWord?: string;
  prompt?: string;
};

export function WorldScreen () {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [worldStateFormData, setWorldFormData] = useState<WorldFormData>(setInitialWorldState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useWorldScreenLogic(setWorlds);

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

    try {
      await onSaveWorld(worldStateFormData, setWorldFormData, setShowForm, setWorlds);
    } catch (error) {
      setFormErrors({ name: (error as Error).message });
    }
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
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Worlds</Text>
        </View>

        <WorldPanel
          worlds={worlds}
          onEdit={handleEditWorld}
          onDelete={(world: World) => onEraseWorld(world, setWorlds)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewWorld}
        >
          <Text style={styles.addButtonText}>Add World</Text>
        </TouchableOpacity>

        <WorldForm
          showForm={showForm}
          worldStateFormData={worldStateFormData}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setWorldFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}
