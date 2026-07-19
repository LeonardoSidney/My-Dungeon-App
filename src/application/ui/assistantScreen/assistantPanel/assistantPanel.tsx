import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Assistant } from '@domain/entities';
import { styles } from './styles';

type AssistantPanelProps = {
  assistants: Assistant[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (assistant: Assistant) => void;
  onDelete: (assistantId: string) => void;
};

export function AssistantPanel ({ assistants, loading, onAdd, onEdit, onDelete }: AssistantPanelProps) {
  return (
    <>
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {!loading && assistants.length === 0 && (
        <Text style={styles.emptyText}>No assistants found.</Text>
      )}
      {!loading &&
        assistants.map((assistant) => (
          <View key={assistant.id} style={styles.assistantItem}>
            <View style={styles.assistantInfo}>
              <Text style={styles.assistantName}>{assistant.name}</Text>
              <Text style={styles.assistantDetails}>
                Model: {assistant.model.name}
              </Text>
            </View>
            <View style={styles.assistantActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEdit(assistant)}
              >
                <Text style={styles.actionButtonText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDelete(assistant.id)}
              >
                <Text style={styles.actionButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAdd}
      >
        <Text style={styles.addButtonText}>Add Assistant</Text>
      </TouchableOpacity>
    </>
  );
}
