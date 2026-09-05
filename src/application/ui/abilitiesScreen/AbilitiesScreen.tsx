import React, { useCallback, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ability } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, useEntityScreenLoad } from '@application/ui/components';
import { useControllers } from '@adapters/ui/ControllersProvider';
import { AbilityFormData, FormErrors, abilityFormConfig } from './constants';
import { setInitialAbilityState } from './setInitialAbilityState';
import { handleAbilityFormChange } from './handleAbilityFormChange';
import { loadAbilities } from './loadAbilities';
import { onAddNewAbility } from './onAddNewAbility';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseAbility } from './onEraseAbility';
import { onSaveAbility } from './onSaveAbility';

export function AbilitiesScreen () {
  const { getAbilities, createAbility, editAbility, eraseAbility } = useControllers();
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [abilityStateFormData, setAbilityFormData] = useState<AbilityFormData>(setInitialAbilityState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const loadEntities = useCallback(() => loadAbilities(getAbilities, setAbilities), [getAbilities, setAbilities]);

  useEntityScreenLoad(loadEntities);

  const handleFormSave = async () => {
    const errors: FormErrors = {};
    if (!abilityStateFormData.name.trim()) errors.name = 'Name is required';
    if (!abilityStateFormData.activationWord.trim()) errors.activationWord = 'Activation Word is required';
    if (!abilityStateFormData.prompt.trim()) errors.prompt = 'Prompt is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    await onSaveAbility(abilityStateFormData, createAbility, editAbility, getAbilities, setAbilityFormData, setShowForm, setAbilities);
  };

  const handleFormChange = (field: keyof AbilityFormData, value: string) => {
    setFormErrors(prev => {
      const next = { ...prev };
      const errorField = field as keyof FormErrors;
      if (next[errorField]) {
        delete next[errorField];
      }
      return next;
    });
    handleAbilityFormChange(setAbilityFormData)(field, value);
  };

  const handleAddNewAbility = () => {
    setFormErrors({});
    onAddNewAbility(setShowForm, setAbilityFormData);
  };

  const handleEditAbility = (ability: Ability) => {
    setFormErrors({});
    onEditForm(ability, setShowForm, setAbilityFormData);
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Abilities</Text>
        </View>

        <CrudEntityList
          items={abilities}
          emptyText="No abilities found."
          getDetailText={(ability) => ability.activationWord}
          onEdit={handleEditAbility}
          onDelete={(ability) => onEraseAbility(ability, eraseAbility, getAbilities, setAbilities)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewAbility}
        >
          <Text style={styles.addButtonText}>Add Ability</Text>
        </TouchableOpacity>

        <ActivationPromptForm
          showForm={showForm}
          formData={abilityStateFormData}
          config={abilityFormConfig}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setAbilityFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}
