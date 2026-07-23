import React from 'react';
import { KeyboardAvoidingView, Platform, Text, View, ScrollView } from 'react-native';
import { styles } from './styles';
import { SamplerPanel } from './samplerPanel';
import { SamplerForm } from './samplerForm';
import { useSamplerScreenLogic } from './useSamplerScreenLogic';

export function SamplerScreen () {
  const {
    samplers,
    loading,
    showForm,
    editingSampler,
    resetKey,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFormClose,
    handleFormSave,
  } = useSamplerScreenLogic();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Samplers</Text>
          </View>

          <SamplerPanel
            samplers={samplers}
            loading={loading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <SamplerForm
            visible={showForm}
            onClose={handleFormClose}
            onSave={handleFormSave}
            initialData={editingSampler}
            resetKey={resetKey}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
