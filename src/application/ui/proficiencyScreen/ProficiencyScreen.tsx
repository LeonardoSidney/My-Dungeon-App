import React, { useCallback, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Proficiency } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, useEntityScreenLoad } from '@application/ui/components';
import { useControllers } from '@adapters/ui/ControllersProvider';
import { ProficiencyFormData, FormErrors, proficiencyFormConfig } from './constants';
import { setInitialProficiencyState } from './setInitialProficiencyState';
import { handleProficiencyFormChange } from './handleProficiencyFormChange';
import { loadProficiencies } from './loadProficiencies';
import { onAddNewProficiency } from './onAddNewProficiency';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseProficiency } from './onEraseProficiency';
import { onSaveProficiency } from './onSaveProficiency';

export function ProficiencyScreen () {
  const { getProficiencies, createProficiency, editProficiency, eraseProficiency } = useControllers();
  const [proficiencies, setProficiencies] = useState<Proficiency[]>([]);
  const [proficiencyStateFormData, setProficiencyFormData] = useState<ProficiencyFormData>(setInitialProficiencyState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const loadEntities = useCallback(() => loadProficiencies(getProficiencies, setProficiencies), [getProficiencies, setProficiencies]);

  useEntityScreenLoad(loadEntities);

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

    await onSaveProficiency(proficiencyStateFormData, createProficiency, editProficiency, getProficiencies, setProficiencyFormData, setShowForm, setProficiencies);
  };

  const handleFormChange = (field: keyof ProficiencyFormData, value: string) => {
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
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Proficiencies</Text>
        </View>

        <CrudEntityList
          items={proficiencies}
          emptyText="No proficiencies found."
          getDetailText={(proficiency) => proficiency.activationWord}
          onEdit={handleEditProficiency}
          onDelete={(proficiency) => onEraseProficiency(proficiency, eraseProficiency, getProficiencies, setProficiencies)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewProficiency}
        >
          <Text style={styles.addButtonText}>Add Proficiency</Text>
        </TouchableOpacity>

        <ActivationPromptForm
          showForm={showForm}
          formData={proficiencyStateFormData}
          config={proficiencyFormConfig}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setProficiencyFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}
