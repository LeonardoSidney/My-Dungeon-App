import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ability } from '@domain/entities';
import { styles } from './styles';
import { AbilityPanel } from './abilitiesPanel';
import { AbilityForm } from './abilitiesForm';
import { useAbilitiesScreenLogic } from './useAbilitiesScreenLogic';
import { AbilityFormData, FormErrors } from './constants';
import { setInitialAbilityState } from './setInitialAbilityState';
import { handleAbilityFormChange } from './handleAbilityFormChange';
import { onAddNewAbility } from './onAddNewAbility';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseAbility } from './onEraseAbility';
import { onSaveAbility } from './onSaveAbility';

export function AbilitiesScreen () {
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [abilityStateFormData, setAbilityFormData] = useState<AbilityFormData>(setInitialAbilityState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useAbilitiesScreenLogic(setAbilities);

  const handleFormSave = async () => {
    const errors: FormErrors = {};
    if (!abilityStateFormData.name.trim()) errors.name = 'Name is required';
    if (!abilityStateFormData.activationWorld.trim()) errors.activationWorld = 'Activation World is required';
    if (!abilityStateFormData.prompt.trim()) errors.prompt = 'Prompt is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    await onSaveAbility(abilityStateFormData, setAbilityFormData, setShowForm, setAbilities);
  };

  const handleFormChange = (field: keyof AbilityFormData, value: string | Date) => {
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
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Abilities</Text>
        </View>

        <AbilityPanel
          abilities={abilities}
          onEdit={handleEditAbility}
          onDelete={(ability) => onEraseAbility(ability, setAbilities)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewAbility}
        >
          <Text style={styles.addButtonText}>Add Ability</Text>
        </TouchableOpacity>

        <AbilityForm
          showForm={showForm}
          abilityStateFormData={abilityStateFormData}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setAbilityFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}
