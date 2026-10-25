import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { styles } from './styles';
import { colors } from '../../theme';
import { getSamplerDetailsText } from './functions';
import { SamplerPanelProps } from '../constants';

export function SamplerPanel (params: SamplerPanelProps) {
  const { samplers, isLoading, onEdit, onDelete } = params;

  return (
    <>
      {isLoading && (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
      {!isLoading && samplers.length === 0 && (
        <Text style={styles.emptyText}>No samplers found.</Text>
      )}
      {!isLoading && samplers.map((sampler, index) => (
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
                <Pencil size={16} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDelete(sampler)}
              >
                <Trash2 size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </>
  );
}
