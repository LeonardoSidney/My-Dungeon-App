import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CharacterFormProps } from './constants';
import { SelectList } from './selectList';
import { styles } from './styles';
import { useCharacterForm } from './useCharacterForm';
import { useCharacterSave } from './useCharacterSave';

export function CharacterForm ({
  visible,
  onClose,
  onSave,
  initialData,
  assistants,
  selectedAssistant,
  onAssistantChange,
  abilities,
  proficiencies,
  statuses
}: CharacterFormProps) {
  const { formState,
    updateField,
    setLoading,
    selectedAbilities,
    selectedProficiencies,
    selectedStatuses,
    toggleAbility,
    toggleProficiency,
    toggleStatus,
    attributes,
    addAttribute,
    removeAttribute,
    updateAttribute
  } = useCharacterForm(initialData);
  const { handleSave } = useCharacterSave({ onSave, onClose, setLoading });

  const isEditing = initialData !== null;

  if (!visible) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {isEditing ? 'Edit Character' : 'New Character'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, !formState.name.trim() && styles.inputError]}
            value={formState.name}
            onChangeText={(value) => updateField('name', value)}
            placeholder="e.g., NPC Merchant"
            placeholderTextColor="#666"
          />
          {!formState.name.trim() && (
            <Text style={styles.errorText}>Name is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activation Word</Text>
          <TextInput
            style={[styles.input, !formState.activationWord.trim() && styles.inputError]}
            value={formState.activationWord}
            onChangeText={(value) => updateField('activationWord', value)}
            placeholder="e.g., Merchant"
            placeholderTextColor="#666"
          />
          {!formState.activationWord.trim() && (
            <Text style={styles.errorText}>Activation word is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Assistant</Text>
          <View style={styles.assistantDropdown}>
            {assistants.map((assistant) => (
              <TouchableOpacity
                key={assistant.id}
                style={[
                  styles.assistantOption,
                  selectedAssistant?.id === assistant.id && styles.assistantOptionSelected
                ]}
                onPress={() => onAssistantChange(assistant)}
              >
                <Text style={styles.assistantOptionText}>{assistant.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {!selectedAssistant && (
            <Text style={styles.errorText}>Assistant is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prompt</Text>
          <TextInput
            style={[styles.input, !formState.prompt.trim() && styles.inputError, styles.promptInput]}
            value={formState.prompt}
            onChangeText={(value) => updateField('prompt', value)}
            placeholder="Enter the character prompt..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />
          {!formState.prompt.trim() && (
            <Text style={styles.errorText}>Prompt is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observation (optional)</Text>
          <TextInput
            style={[styles.input, styles.observationInput]}
            value={formState.observation}
            onChangeText={(value) => updateField('observation', value)}
            placeholder="Additional observations..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
          />
        </View>

        {abilities.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Abilities</Text>
            <SelectList
              items={abilities}
              selectedItems={selectedAbilities}
              onToggle={toggleAbility}
            />
            {selectedAbilities.length > 0 && (
              <View style={styles.selectedTags}>
                {selectedAbilities.map((ability) => (
                  <TouchableOpacity
                    key={ability.id}
                    style={styles.tag}
                    onPress={() => toggleAbility(ability)}
                  >
                    <Text style={styles.tagText}>{ability.name}</Text>
                    <Text style={styles.tagClose}>×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {proficiencies.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Proficiencies</Text>
            <SelectList
              items={proficiencies}
              selectedItems={selectedProficiencies}
              onToggle={toggleProficiency}
            />
            {selectedProficiencies.length > 0 && (
              <View style={styles.selectedTags}>
                {selectedProficiencies.map((proficiency) => (
                  <TouchableOpacity
                    key={proficiency.id}
                    style={styles.tag}
                    onPress={() => toggleProficiency(proficiency)}
                  >
                    <Text style={styles.tagText}>{proficiency.name}</Text>
                    <Text style={styles.tagClose}>×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {statuses.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Statuses</Text>
            <SelectList
              items={statuses}
              selectedItems={selectedStatuses}
              onToggle={toggleStatus}
            />
            {selectedStatuses.length > 0 && (
              <View style={styles.selectedTags}>
                {selectedStatuses.map((status) => (
                  <TouchableOpacity
                    key={status.id}
                    style={styles.tag}
                    onPress={() => toggleStatus(status)}
                  >
                    <Text style={styles.tagText}>{status.name}</Text>
                    <Text style={styles.tagClose}>×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.inputGroup}>
          <View style={styles.attributesHeader}>
            <Text style={styles.label}>Attributes</Text>
            <TouchableOpacity onPress={addAttribute} style={styles.addAttributeButton}>
              <Text style={styles.addAttributeButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
          {attributes.map((attr, index) => (
            <View key={index} style={styles.attributeRow}>
              <TextInput
                style={[styles.attributeInput, styles.attributeNameInput]}
                value={attr.name}
                onChangeText={(value) => updateAttribute(index, 'name', value)}
                placeholder="Name (e.g., Strength)"
                placeholderTextColor="#666"
              />
              <TextInput
                style={[styles.attributeInput, styles.attributeValueInput]}
                value={attr.value.toString()}
                onChangeText={(value) => updateAttribute(index, 'value', value)}
                placeholder="Value"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
              <TouchableOpacity
                onPress={() => removeAttribute(index)}
                style={styles.removeAttributeButton}
              >
                <Text style={styles.removeAttributeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.cancelButton}
            disabled={false}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSave(formState.name, formState.activationWord, formState.prompt, formState.observation, selectedAssistant, selectedAbilities, selectedProficiencies, selectedStatuses, attributes)}
            style={[
              styles.saveButton,
              !formState.name.trim() ||
                !formState.activationWord.trim() ||
                !formState.prompt.trim() ||
                !selectedAssistant
                ? styles.saveButtonDisabled
                : undefined,
            ]}
            disabled={
              !formState.name.trim() ||
              !formState.activationWord.trim() ||
              !formState.prompt.trim() ||
              !selectedAssistant
            }
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
