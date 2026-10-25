import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Attribute } from '@domain/entities';
import { formStyles } from '@presentation/components';
import { colors } from '@presentation/theme';

type AttributesFieldProps = {
  attributes: Attribute[];
  onChange: (attributes: Attribute[]) => void;
};

export function AttributesField ({ attributes, onChange }: AttributesFieldProps) {
  const addAttribute = () => onChange([...attributes, { name: '', value: 0 }]);

  const updateAttribute = (index: number, changes: Partial<Attribute>) => {
    onChange(attributes.map((attribute, i) => (i === index ? { ...attribute, ...changes } : attribute)));
  };

  const removeAttribute = (index: number) => onChange(attributes.filter((_, i) => i !== index));

  return (
    <View style={formStyles.inputGroup}>
      <View style={styles.header}>
        <Text style={formStyles.label}>Attributes</Text>
        <TouchableOpacity onPress={addAttribute} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {attributes.map((attribute, index) => (
        <View key={index} style={styles.row}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            value={attribute.name}
            onChangeText={name => updateAttribute(index, { name })}
            placeholder="Name (e.g., Strength)"
            placeholderTextColor={colors.placeholder}
          />
          <TextInput
            style={[styles.input, styles.valueInput]}
            value={attribute.value.toString()}
            onChangeText={value => updateAttribute(index, { value: Number(value) || 0 })}
            placeholder="Value"
            placeholderTextColor={colors.placeholder}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => removeAttribute(index)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.successBright,
  },
  addButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'nowrap',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: colors.text,
  },
  nameInput: {
    flex: 1,
    minWidth: 0,
  },
  valueInput: {
    flex: 0.5,
    minWidth: 0,
  },
  removeButton: {
    minWidth: 36,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.danger,
  },
  removeButtonText: {
    fontSize: 24,
    color: colors.text,
    fontWeight: 'bold',
    lineHeight: 24,
  },
});
