import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { SystemPromptPanelProps } from './constants';

export function SystemPromptPanel (params: SystemPromptPanelProps) {
  const { systemPrompts, onEdit, onDelete } = params;

  return (
    <>
      {systemPrompts.length === 0 && (
        <Text style={styles.emptyText}>No system prompts found.</Text>
      )}
      {systemPrompts.map((systemPrompt, index) => (
        <View key={index} style={styles.systemPromptItem}>
          <View style={styles.systemPromptInfo}>
            <Text style={styles.systemPromptName}>{systemPrompt.name}</Text>
            <Text style={styles.systemPromptDetails} numberOfLines={1}>
              {systemPrompt.content}
            </Text>
          </View>
          <View style={styles.systemPromptActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(systemPrompt)}
            >
              <Text style={styles.actionButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(systemPrompt)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );
}
