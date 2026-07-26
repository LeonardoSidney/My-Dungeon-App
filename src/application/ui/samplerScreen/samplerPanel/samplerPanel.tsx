import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { getSamplerDetailsText } from './functions';
import { SamplerPanelProps } from '../constants';

export function SamplerPanel (params: SamplerPanelProps) {
  const { samplers, onEdit, onDelete } = params;

  return (
    <>
      {samplers.length === 0 && (
        <Text style={styles.emptyText}>No samplers found.</Text>
      )}
      {samplers.map((sampler, index) => (
        <View key={index} style={styles.samplerItem}>
          <View style={styles.samplerInfo}>
            <Text style={styles.samplerName}>{sampler.name}</Text>
            <Text style={styles.samplerDetails}>{getSamplerDetailsText(sampler)}</Text>
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
                onPress={() => onDelete(sampler)}
              >
                <Text style={styles.actionButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </>
  );
}
