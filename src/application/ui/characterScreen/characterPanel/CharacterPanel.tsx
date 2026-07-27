import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Character } from '@domain/entities';
import { styles } from './styles';

type CharacterPanelProps = {
  characters: Character[];
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
};

export function CharacterPanel ({ characters, onEdit, onDelete }: CharacterPanelProps) {
  return (
    <>
      {characters.length === 0 && (
        <Text style={styles.emptyText}>No characters found.</Text>
      )}
      {characters.map((character) => (
        <View key={character.id} style={styles.characterItem}>
          <View style={styles.characterInfo}>
            <Text style={styles.characterName}>{character.name}</Text>
            <Text style={styles.characterDetails}>
              {character.activationWord}
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
              onPress={() => onDelete(character)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );
}
