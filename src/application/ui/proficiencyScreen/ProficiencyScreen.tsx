import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Proficiency } from '@domain/entities';
import { styles } from './styles';
import { ProficiencyPanel } from './proficiencyPanel';
import { ProficiencyForm } from './proficiencyForm';
import { useProficiencyScreenLogic } from './useProficiencyScreenLogic';
import { ProficiencyFormData } from './constants';
import { setInitialProficiencyState } from './setInitialProficiencyState';
import { handleProficiencyFormChange } from './handleProficiencyFormChange';
import { onAddNewProficiency } from './onAddNewProficiency';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './proficiencyForm/onEditForm';
import { onEraseProficiency } from './proficiencyPanel/onEraseProficiency';
import { onSaveProficiency } from './proficiencyForm/onSaveProficiency';

export function ProficiencyScreen () {
  const [proficiencies, setProficiencies] = useState<Proficiency[]>([]);
  const [proficiencyStateFormData, setProficiencyFormData] = useState<ProficiencyFormData>(setInitialProficiencyState());
  const [showForm, setShowForm] = useState(false);

  useProficiencyScreenLogic(setProficiencies);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Proficiencies</Text>
        </View>

        <ProficiencyPanel
          proficiencies={proficiencies}
          onEdit={(proficiency) => onEditForm(proficiency, setShowForm, setProficiencyFormData)}
          onDelete={(proficiency) => onEraseProficiency(proficiency, setProficiencies)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddNewProficiency(setShowForm, setProficiencyFormData)}
        >
          <Text style={styles.addButtonText}>Add Proficiency</Text>
        </TouchableOpacity>

        <ProficiencyForm
          showForm={showForm}
          proficiencyStateFormData={proficiencyStateFormData}
          onChange={handleProficiencyFormChange(setProficiencyFormData)}
          onCancel={() => onCancelForm(setShowForm, setProficiencyFormData)}
          onSave={() => onSaveProficiency(proficiencyStateFormData, setProficiencyFormData, setShowForm, setProficiencies)}
        />

      </ScrollView>
    </View>
  );
}
