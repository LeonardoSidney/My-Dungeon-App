import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { SelectList, SelectItemBase } from '../selectList';
import { SelectListSectionProps } from './constants';

export function SelectListSection<T extends SelectItemBase> ({
  label,
  items,
  selectedItems,
  onToggle,
  emptyText,
  visibleSelectedItems,
}: SelectListSectionProps<T>) {
  const visibleItems = visibleSelectedItems ?? selectedItems;

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <SelectList items={items} selectedItems={selectedItems} onToggle={onToggle} />
      {visibleItems.length > 0 && (
        <View style={styles.selectedTagsContainer}>
          {visibleItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.selectedTag}
              onPress={() => onToggle(item)}
            >
              <Text style={styles.selectedTagText}>{item.name}</Text>
              <Text style={styles.selectedTagRemove}>×</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {items.length === 0 && emptyText && (
        <Text style={styles.emptyDropdownText}>{emptyText}</Text>
      )}
    </View>
  );
}
