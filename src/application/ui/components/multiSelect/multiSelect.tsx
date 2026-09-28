import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { MultiSelectProps } from './constants';

/**
 * Multi-selection list: renders the available items, highlights the
 * selected ones and reports every toggle via `onToggle`. Optionally
 * renders the selected items as removable tags below the list.
 * Controlled component — it owns no state.
 */
export function MultiSelect<T extends { id: string; name: string; }> ({
  items,
  selectedItems,
  onToggle,
  hasError,
  showTags,
  emptyMessage,
}: MultiSelectProps<T>) {
  const shouldScroll = items.length > 4;
  const isEmpty = items.length === 0;

  const renderItems = items.map((item) => {
    const isSelected = selectedItems.some((s) => s.id === item.id);
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.option, isSelected && styles.optionSelected]}
        onPress={() => onToggle(item)}
      >
        <Text style={styles.optionText}>{item.name}</Text>
      </TouchableOpacity>
    );
  });

  const renderTags = selectedItems.map((item) => (
    <TouchableOpacity key={item.id} style={styles.tag} onPress={() => onToggle(item)}>
      <Text style={styles.tagText}>{item.name}</Text>
      <Text style={styles.tagRemove}>×</Text>
    </TouchableOpacity>
  ));

  return (
    <View>
      <View style={[styles.container, hasError && styles.inputError]}>
        {isEmpty ? (
          <Text style={styles.emptyText}>{emptyMessage ?? 'No items available'}</Text>
        ) : shouldScroll ? (
          <ScrollView nestedScrollEnabled style={styles.scrollable}>
            {renderItems}
          </ScrollView>
        ) : (
          renderItems
        )}
      </View>
      {showTags && selectedItems.length > 0 && (
        <View style={styles.selectedTags}>
          {renderTags}
        </View>
      )}
    </View>
  );
}
