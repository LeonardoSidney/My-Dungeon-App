import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Attribute } from '@domain/entities';
import { formStyles } from '@application/ui/components';
import { styles } from './styles';

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

export function renderAttributesField (
  attributes: Attribute[],
  onChangeAttributes: (attributes: Attribute[]) => void
) {
  return (
    <View style={formStyles.inputGroup}>
      <View style={styles.attributesHeader}>
        <Text style={formStyles.label}>Attributes</Text>
        <TouchableOpacity
          onPress={() => onChangeAttributes(handleAddAttribute(attributes))}
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
            onChangeText={value => onChangeAttributes(handleAttributeNameChange(attributes, index, value))}
            placeholder="Name (e.g., Strength)"
            placeholderTextColor="#666"
          />
          <TextInput
            style={[styles.attributeInput, styles.attributeValueInput]}
            value={attr.value.toString()}
            onChangeText={value => onChangeAttributes(handleAttributeValueChange(attributes, index, value))}
            placeholder="Value"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => onChangeAttributes(handleRemoveAttribute(attributes, index))}
            style={styles.removeAttributeButton}
          >
            <Text style={styles.removeAttributeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
