import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { formStyles } from '../form/formStyles';
import { styles } from './MultiSelect.styles';

const SCROLL_THRESHOLD = 4;

type SelectItem = { id: string; name: string; };

type MultiSelectProps<T extends SelectItem> = {
  items: T[];
  selectedItems: T[];
  /** Toggles the item in the selection (add when off, remove when on). */
  onToggle: (item: T) => void;
  /** Applies the error border (form validation). */
  hasError?: boolean;
  showTags?: boolean;
  tagItems?: T[];
  /** Message displayed when there are no items. */
  emptyMessage?: string;
};

export function MultiSelect<T extends SelectItem> ({
  items,
  selectedItems,
  onToggle,
  hasError,
  showTags,
  tagItems = selectedItems,
  emptyMessage = 'No items available',
}: MultiSelectProps<T>) {
  const options = items.map(item => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    return (
      <TouchableOpacity
        key={item.id}
        style={[formStyles.option, isSelected && formStyles.optionSelected]}
        onPress={() => onToggle(item)}
      >
        <Text style={formStyles.optionText}>{item.name}</Text>
      </TouchableOpacity>
    );
  });

  const renderOptions = () => {
    if (items.length === 0) {
      return <Text style={formStyles.emptyText}>{emptyMessage}</Text>;
    }
    if (items.length > SCROLL_THRESHOLD) {
      return <ScrollView nestedScrollEnabled style={styles.scrollable}>{options}</ScrollView>;
    }
    return options;
  };

  return (
    <View>
      <View style={[styles.container, hasError && formStyles.inputError]}>
        {renderOptions()}
      </View>
      {showTags && tagItems.length > 0 && (
        <View style={styles.selectedTags}>
          {tagItems.map(item => (
            <TouchableOpacity key={item.id} style={styles.tag} onPress={() => onToggle(item)}>
              <Text style={styles.tagText}>{item.name}</Text>
              <Text style={styles.tagRemove}>×</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
