import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Sampler } from '@domain/entities';
import { styles } from './styles';
import { getSamplerDetailsText } from './functions';

type SamplerPanelProps = {
  samplers: Sampler[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (sampler: Sampler) => void;
  onDelete: (samplerId: string) => void;
};

export function SamplerPanel ({ samplers, loading, onAdd, onEdit, onDelete }: SamplerPanelProps) {
  return (
    <>
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {!loading && samplers.length === 0 && (
        <Text style={styles.emptyText}>No samplers found.</Text>
      )}
      {!loading &&
        samplers.map((sampler) => (
          <View key={sampler.id} style={styles.samplerItem}>
            <View style={styles.samplerInfo}>
              <Text style={styles.samplerName}>{sampler.name}</Text>
              <Text style={styles.samplerDetails}>
                {getSamplerDetailsText(sampler)}
              </Text>
            </View>
            {!sampler.systemDefault && (
              <View style={styles.samplerActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onEdit(sampler)}
                >
                  <Text style={styles.actionButtonText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onDelete(sampler.id)}
                >
                  <Text style={styles.actionButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAdd}
      >
        <Text style={styles.addButtonText}>Add Sampler</Text>
      </TouchableOpacity>
    </>
  );
}
