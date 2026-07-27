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

type FormErrors = {
  name?: string;
  activationWord?: string;
  prompt?: string;
};

export function ProficiencyScreen () {
  const [proficiencies, setProficiencies] = useState<Proficiency[]>([]);
  const [proficiencyStateFormData, setProficiencyFormData] = useState<ProficiencyFormData>(setInitialProficiencyState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useProficiencyScreenLogic(setProficiencies);

  const handleFormSave = async () => {
    const errors: FormErrors = {};
    if (!proficiencyStateFormData.name.trim()) errors.name = 'Name is required';
    if (!proficiencyStateFormData.activationWord.trim()) errors.activationWord = 'Activation Word is required';
    if (!proficiencyStateFormData.prompt.trim()) errors.prompt = 'Prompt is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      await onSaveProficiency(proficiencyStateFormData, setProficiencyFormData, setShowForm, setProficiencies);
    } catch (error) {
      setFormErrors({ name: (error as Error).message });
    }
  };

  const handleFormChange = (field: keyof ProficiencyFormData, value: string | Date) => {
    setFormErrors(prev => {
      const next = { ...prev };
      const errorField = field as keyof FormErrors;
      if (next[errorField]) {
        delete next[errorField];
      }
      return next;
    });
    handleProficiencyFormChange(setProficiencyFormData)(field, value);
  };

  const handleAddNewProficiency = () => {
    setFormErrors({});
    onAddNewProficiency(setShowForm, setProficiencyFormData);
  };

  const handleEditProficiency = (proficiency: Proficiency) => {
    setFormErrors({});
    onEditForm(proficiency, setShowForm, setProficiencyFormData);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Proficiencies</Text>
        </View>

        <ProficiencyPanel
          proficiencies={proficiencies}
          onEdit={handleEditProficiency}
          onDelete={(proficiency) => onEraseProficiency(proficiency, setProficiencies)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewProficiency}
        >
          <Text style={styles.addButtonText}>Add Proficiency</Text>
        </TouchableOpacity>

        <ProficiencyForm
          showForm={showForm}
          proficiencyStateFormData={proficiencyStateFormData}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setProficiencyFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}
