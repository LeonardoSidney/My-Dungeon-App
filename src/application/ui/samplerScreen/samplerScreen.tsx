import React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { SamplerPanel } from './samplerPanel';
import { SamplerForm } from './samplerForm';
import { useEntityScreen } from '@application/ui/hooks';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { initialSamplerForm, submitSampler, toSamplerFormState, validateSamplerForm } from './form';

export function SamplerScreen () {
  const { getSamplers, createSampler, editSampler, eraseSampler, alert } = useControllers();

  const {
    entities,
    isLoading,
    isError,
    form,
    updateField,
    showForm,
    openAdd,
    openEdit,
    closeForm,
    formErrors,
    save,
    eraseEntity,
  } = useEntityScreen({
    fetch: () => getSamplers.handle(),
    submit: (samplerForm) => submitSampler(samplerForm, createSampler, editSampler),
    erase: (id) => eraseSampler.handle(id),
    toFormState: toSamplerFormState,
    initialForm: initialSamplerForm,
    validate: validateSamplerForm,
    entityName: 'sampler',
    alert,
  });

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {isError ? (
          <Text style={styles.errorText}>Failed to load samplers.</Text>
        ) : (
          <SamplerPanel
            samplers={entities}
            isLoading={isLoading}
            onEdit={openEdit}
            onDelete={eraseEntity}
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={openAdd}
        >
          <Text style={styles.addButtonText}>Add Sampler</Text>
        </TouchableOpacity>

        <SamplerForm
          showForm={showForm}
          samplerStateFormData={form}
          onChange={updateField}
          onCancel={closeForm}
          onSave={save}
          formErrors={formErrors}
        />
      </ScrollView>
    </View>
  );
}
