import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Assistant, Model } from '@domain/entities';
import { styles } from './styles';

type AssistantPanelProps = {
  assistants: Assistant[];
  models: Model[];
  onEdit: (assistant: Assistant) => void;
  onDelete: (assistant: Assistant) => void;
};

function getAssistantModelName (assistant: Assistant, models: Model[]): string {
  const model = models.find(m => m.id === assistant.modelId && m.connectionId === assistant.connectionId);
  const modelName = model?.name;
  return modelName ?? 'unknown';
}

export function AssistantPanel ({ assistants, models, onEdit, onDelete }: AssistantPanelProps) {
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
              Model: {getAssistantModelName(assistant, models)}
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
