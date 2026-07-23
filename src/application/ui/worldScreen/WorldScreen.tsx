import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { styles } from './styles';
import { WorldPanel } from './worldPanel';
import { WorldForm } from './worldForm';
import { useWorldScreenLogic } from './useWorldScreenLogic';

export function WorldScreen () {
  const {
    worlds,
    loading,
    showForm,
    editingWorld,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFormClose,
    handleFormSave,
  } = useWorldScreenLogic();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Worlds</Text>
          </View>

          <WorldPanel
            worlds={worlds}
            loading={loading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <WorldForm
            visible={showForm}
            onClose={handleFormClose}
            onSave={handleFormSave}
            initialData={editingWorld}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
