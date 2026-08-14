import React from 'react';
import { Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { styles } from './styles';
import { CharacterFormProps } from './constants';
import { Ability, Status, Proficiency, Attribute } from '@domain/entities';
import { SelectList } from './selectList';

function handleAbilityToggle (currentAbilities: Ability[], ability: Ability): Ability[] {
  const abilitiesSelected = [...currentAbilities, ability];
  const isAbilitySelected = currentAbilities.some(a => a.id === ability.id);
  const filteredAbilities = currentAbilities.filter(a => a.id !== ability.id);
  return isAbilitySelected ? filteredAbilities : abilitiesSelected;
}

function handleProficiencyToggle (currentProficiencies: Proficiency[], proficiency: Proficiency): Proficiency[] {
  const proficienciesSelected = [...currentProficiencies, proficiency];
  const isProficiencySelected = currentProficiencies.some(p => p.id === proficiency.id);
  const filteredProficiencies = currentProficiencies.filter(p => p.id !== proficiency.id);
  return isProficiencySelected ? filteredProficiencies : proficienciesSelected;
}

function handleStatusToggle (currentStatuses: Status[], status: Status): Status[] {
  const statusesSelected = [...currentStatuses, status];
  const isStatusSelected = currentStatuses.some(s => s.id === status.id);
  const filteredStatuses = currentStatuses.filter(s => s.id !== status.id);
  return isStatusSelected ? filteredStatuses : statusesSelected;
}

function handleAddAttribute (attributes: Attribute[]): Attribute[] {
  return [...attributes, { name: '', value: 0 }];
}

function handleAttributeNameChange (attributes: Attribute[], index: number, value: string): Attribute[] {
  const updated = [...attributes];
  updated[index] = { ...updated[index], name: value };
  return updated;
}

function handleAttributeValueChange (attributes: Attribute[], index: number, value: string): Attribute[] {
  const updated = [...attributes];
  updated[index] = { ...updated[index], value: Number(value) || 0 };
  return updated;
}

function handleRemoveAttribute (attributes: Attribute[], index: number): Attribute[] {
  return attributes.filter((_, i) => i !== index);
}

export function CharacterForm ({
  showForm,
  characterStateFormData,
  onChange,
  onCancel,
  onSave,
  assistants,
  abilities,
  proficiencies,
  statuses,
  formErrors,
}: CharacterFormProps) {
  const { name, activationWord, prompt, observation, assistant, attributes } = characterStateFormData;
  const isEditing = !!characterStateFormData.id;

  if (!showForm) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>{isEditing ? 'Edit Character' : 'New Character'}</Text>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, formErrors.name && styles.inputError]}
            placeholder="e.g., NPC Merchant"
            placeholderTextColor="#666"
            value={name}
            onChangeText={value => onChange('name', value)}
          />
          {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activation Word</Text>
          <TextInput
            style={[styles.input, formErrors.activationWord && styles.inputError]}
            placeholder="e.g., Merchant"
            placeholderTextColor="#666"
            value={activationWord}
            onChangeText={value => onChange('activationWord', value)}
          />
          {formErrors.activationWord && <Text style={styles.errorText}>{formErrors.activationWord}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Assistant</Text>
          <View style={[styles.dropdown, formErrors.assistant && styles.inputError]}>
            <ScrollView keyboardShouldPersistTaps="handled">
              {assistants.map(assistantItem => (
                <TouchableOpacity
                  key={assistantItem.id}
                  style={[styles.dropdownOption, assistant?.id === assistantItem.id && styles.dropdownOptionSelected]}
                  onPress={() => onChange('assistant', assistantItem)}
                >
                  <Text style={styles.dropdownOptionText}>{assistantItem.name}</Text>
                </TouchableOpacity>
              ))}
              {assistants.length === 0 && <Text style={styles.emptyDropdownText}>No assistants available</Text>}
            </ScrollView>
          </View>
          {formErrors.assistant && <Text style={styles.errorText}>{formErrors.assistant}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prompt</Text>
          <TextInput
            style={[styles.promptInput, formErrors.prompt && styles.inputError]}
            placeholder="Enter the character prompt..."
            placeholderTextColor="#666"
            value={prompt}
            onChangeText={value => onChange('prompt', value)}
            multiline
          />
          {formErrors.prompt && <Text style={styles.errorText}>{formErrors.prompt}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observation (optional)</Text>
          <TextInput
            style={styles.observationInput}
            placeholder="Additional observations..."
            placeholderTextColor="#666"
            value={observation}
            onChangeText={value => onChange('observation', value)}
            multiline
          />
        </View>

        {abilities.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Abilities</Text>
            <SelectList
              items={abilities}
              selectedItems={characterStateFormData.abilities}
              onToggle={ability =>
                onChange('abilities', handleAbilityToggle(characterStateFormData.abilities, ability))
              }
            />
            {characterStateFormData.abilities.length > 0 && (
              <View style={styles.selectedTags}>
                {characterStateFormData.abilities.map(ability => (
                  <TouchableOpacity
                    key={ability.id}
                    style={styles.tag}
                    onPress={() =>
                      onChange('abilities', handleAbilityToggle(characterStateFormData.abilities, ability))
                    }
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
              selectedItems={characterStateFormData.proficiencies}
              onToggle={proficiency =>
                onChange('proficiencies', handleProficiencyToggle(characterStateFormData.proficiencies, proficiency))
              }
            />
            {characterStateFormData.proficiencies.length > 0 && (
              <View style={styles.selectedTags}>
                {characterStateFormData.proficiencies.map(proficiency => (
                  <TouchableOpacity
                    key={proficiency.id}
                    style={styles.tag}
                    onPress={() =>
                      onChange(
                        'proficiencies',
                        handleProficiencyToggle(characterStateFormData.proficiencies, proficiency)
                      )
                    }
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
              selectedItems={characterStateFormData.statuses}
              onToggle={status => onChange('statuses', handleStatusToggle(characterStateFormData.statuses, status))}
            />
            {characterStateFormData.statuses.length > 0 && (
              <View style={styles.selectedTags}>
                {characterStateFormData.statuses.map(status => (
                  <TouchableOpacity
                    key={status.id}
                    style={styles.tag}
                    onPress={() => onChange('statuses', handleStatusToggle(characterStateFormData.statuses, status))}
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
            <TouchableOpacity
              onPress={() => onChange('attributes', handleAddAttribute(attributes))}
              style={styles.addAttributeButton}
            >
              <Text style={styles.addAttributeButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
          {attributes.map((attr, index) => (
            <View key={index} style={styles.attributeRow}>
              <TextInput
                style={[styles.attributeInput, styles.attributeNameInput]}
                value={attr.name}
                onChangeText={value => onChange('attributes', handleAttributeNameChange(attributes, index, value))}
                placeholder="Name (e.g., Strength)"
                placeholderTextColor="#666"
              />
              <TextInput
                style={[styles.attributeInput, styles.attributeValueInput]}
                value={attr.value.toString()}
                onChangeText={value => onChange('attributes', handleAttributeValueChange(attributes, index, value))}
                placeholder="Value"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
              <TouchableOpacity
                onPress={() => onChange('attributes', handleRemoveAttribute(attributes, index))}
                style={styles.removeAttributeButton}
              >
                <Text style={styles.removeAttributeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>{isEditing ? 'Save' : 'Create'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
