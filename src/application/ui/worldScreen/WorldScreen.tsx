import React from 'react';
import { Text, View } from 'react-native';
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
      <Text style={styles.title}>Worlds</Text>

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
    </View>
  );
}
