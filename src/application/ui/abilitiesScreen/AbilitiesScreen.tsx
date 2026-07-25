import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ability } from '@domain/entities';
import { styles } from './styles';
import { AbilityPanel } from './abilitiesPanel';
import { AbilityForm } from './abilitiesForm';
import { useAbilitiesScreenLogic } from './useAbilitiesScreenLogic';
import { AbilityFormData } from './constants';
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

  useAbilitiesScreenLogic(setAbilities);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Abilities</Text>
        </View>

        <AbilityPanel
          abilities={abilities}
          onEdit={(ability) => onEditForm(ability, setShowForm, setAbilityFormData)}
          onDelete={(ability) => onEraseAbility(ability, setAbilities)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddNewAbility(setShowForm, setAbilityFormData)}
        >
          <Text style={styles.addButtonText}>Add Ability</Text>
        </TouchableOpacity>

        <AbilityForm
          showForm={showForm}
          abilityStateFormData={abilityStateFormData}
          onChange={handleAbilityFormChange(setAbilityFormData)}
          onCancel={() => onCancelForm(setShowForm, setAbilityFormData)}
          onSave={() => onSaveAbility(abilityStateFormData, setAbilityFormData, setShowForm, setAbilities)}
        />

      </ScrollView>
    </View>
  );
}
