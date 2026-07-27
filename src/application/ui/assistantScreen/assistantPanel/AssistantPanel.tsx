import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Assistant } from '@domain/entities';
import { styles } from './styles';

type AssistantPanelProps = {
  assistants: Assistant[];
  onEdit: (assistant: Assistant) => void;
  onDelete: (assistant: Assistant) => void;
};

export function AssistantPanel ({ assistants, onEdit, onDelete }: AssistantPanelProps) {
  return (
    <>
      {assistants.length === 0 && (
        <Text style={styles.emptyText}>No assistants found.</Text>
      )}
      {assistants.map((assistant) => (
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
              onPress={() => onDelete(assistant)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );
}
