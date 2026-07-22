import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CharacterPanelProps } from './constants';
import { styles } from './styles';

export function CharacterPanel ({ characters, loading, onAdd, onEdit, onDelete }: CharacterPanelProps) {
  return (
    <>
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {!loading && characters.length === 0 && (
        <Text style={styles.emptyText}>No characters found.</Text>
      )}
      {!loading &&
        characters.map((character) => (
          <View key={character.id} style={styles.characterItem}>
            <View style={styles.characterInfo}>
              <Text style={styles.characterName}>{character.name}</Text>
              <Text style={styles.characterDetails}>
                Activation: {character.activationWord}
              </Text>
            </View>
            <View style={styles.characterActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEdit(character)}
              >
                <Text style={styles.actionButtonText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDelete(character.id)}
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
        <Text style={styles.addButtonText}>Add Character</Text>
      </TouchableOpacity>
    </>
  );
}
