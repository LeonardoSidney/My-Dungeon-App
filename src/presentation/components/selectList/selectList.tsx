import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { SelectItemBase, SelectListProps } from './constants';

export function SelectList<T extends SelectItemBase> ({ items, selectedItems, onToggle }: SelectListProps<T>) {
  const shouldScroll = items.length > 4;

  const renderItems = items.map((item) => {
    const isSelected = selectedItems.some((s) => s.id === item.id);
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.selectOption, isSelected && styles.selectOptionSelected]}
        onPress={() => onToggle(item)}
      >
        <Text style={styles.selectOptionText}>{item.name}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.selectListContainer}>
      {shouldScroll ? (
        <ScrollView nestedScrollEnabled style={styles.selectListScrollable}>
          {renderItems}
        </ScrollView>
      ) : (
        renderItems
      )}
    </View>
  );
}
