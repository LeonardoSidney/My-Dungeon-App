import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formStyles } from '../form/formStyles';

type SingleSelectProps<T extends { id: string; }> = {
  items: T[];
  selectedId?: string;
  /**
   * Derives the unique key of each option. When the selection of an item
   * depends on more than the id (e.g., Model is selected by id + connectionId),
   * pass a composite key here and use the same composite key as `selectedId`.
   */
  itemKey?: (item: T) => string;
  /** Custom label for the option. Defaults to item.name. */
  renderLabel?: (item: T) => string;
  /** Applies the error border (e.g., form validation). */
  hasError?: boolean;
  /** Message displayed when there are no items. */
  emptyMessage?: string;
  onSelect: (item: T) => void;
};

const defaultItemKey = (item: { id: string; }) => item.id;
const defaultLabel = (item: { id: string; name?: string; }) => item.name ?? item.id;

export function SingleSelect<T extends { id: string; }> ({
  items,
  selectedId,
  itemKey = defaultItemKey,
  renderLabel = defaultLabel,
  hasError,
  emptyMessage = 'No items available',
  onSelect,
}: SingleSelectProps<T>) {
  return (
    <View style={[formStyles.dropdown, hasError && formStyles.inputError]}>
      <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled style={styles.scrollable}>
        {items.map(item => (
          <TouchableOpacity
            key={itemKey(item)}
            style={[formStyles.option, itemKey(item) === selectedId && formStyles.optionSelected]}
            onPress={() => onSelect(item)}
          >
            <Text style={formStyles.optionText}>{renderLabel(item)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {items.length === 0 && <Text style={formStyles.emptyText}>{emptyMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollable: {
    maxHeight: 150,
  },
});
