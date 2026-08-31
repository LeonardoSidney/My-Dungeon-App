import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Sampler, MirostatEnum } from '@domain/entities';
import { styles } from './styles';
import { SamplerPanel } from './samplerPanel';
import { SamplerForm } from './samplerForm';
import { useSamplerScreenLogic } from './useSamplerScreenLogic';
import { SamplerFormData, FormErrors } from './constants';
import { setInitialSamplerState } from './setInitialSamplerState';
import { handleSamplerFormChange } from './handleSamplerFormChange';
import { onAddNewSampler } from './onAddNewSampler';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseSampler } from './onEraseSampler';
import { onSaveSampler } from './onSaveSampler';

export function SamplerScreen () {
  const [samplers, setSamplers] = useState<Sampler[]>([]);
  const [samplerStateFormData, setSamplerFormData] = useState<SamplerFormData>(setInitialSamplerState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useSamplerScreenLogic(setSamplers);

  const handleFormSave = async () => {
    const errors: FormErrors = {};
    if (!samplerStateFormData.name.trim()) errors.name = 'Name is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    await onSaveSampler(samplerStateFormData, setSamplerFormData, setShowForm, setSamplers);
  };

  const handleFormChange = (field: keyof SamplerFormData, value: string | Date | MirostatEnum | undefined) => {
    setFormErrors(prev => {
      const next = { ...prev };
      const errorField = field as keyof FormErrors;
      if (next[errorField]) {
        delete next[errorField];
      }
      return next;
    });
    handleSamplerFormChange(setSamplerFormData)(field, value);
  };

  const handleAddNewSampler = () => {
    setFormErrors({});
    onAddNewSampler(setShowForm, setSamplerFormData);
  };

  const handleEditSampler = (sampler: Sampler) => {
    setFormErrors({});
    onEditForm(sampler, setShowForm, setSamplerFormData);
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Samplers</Text>
        </View>

        <SamplerPanel
          samplers={samplers}
          onEdit={handleEditSampler}
          onDelete={(sampler: Sampler) => onEraseSampler(sampler, setSamplers)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewSampler}
        >
          <Text style={styles.addButtonText}>Add Sampler</Text>
        </TouchableOpacity>

        <SamplerForm
          showForm={showForm}
          samplerStateFormData={samplerStateFormData}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setSamplerFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}
