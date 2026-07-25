import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Sampler } from '@domain/entities';
import { styles } from './styles';
import { SamplerPanel } from './samplerPanel';
import { SamplerForm } from './samplerForm';
import { useSamplerScreenLogic } from './useSamplerScreenLogic';
import { SamplerFormData } from './constants';
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

  useSamplerScreenLogic(setSamplers);

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Samplers</Text>
        </View>

        <SamplerPanel
          samplers={samplers}
          onEdit={(sampler: Sampler) => onEditForm(sampler, setShowForm, setSamplerFormData)}
          onDelete={(sampler: Sampler) => onEraseSampler(sampler, setSamplers)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddNewSampler(setShowForm, setSamplerFormData)}
        >
          <Text style={styles.addButtonText}>Add Sampler</Text>
        </TouchableOpacity>

        <SamplerForm
          showForm={showForm}
          samplerStateFormData={samplerStateFormData}
          onChange={handleSamplerFormChange(setSamplerFormData)}
          onCancel={() => onCancelForm(setShowForm, setSamplerFormData)}
          onSave={() => onSaveSampler(samplerStateFormData, setSamplerFormData, setShowForm, setSamplers)}
        />

      </ScrollView>
    </View>
  );
}
