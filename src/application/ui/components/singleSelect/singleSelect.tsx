import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { SingleSelectProps } from './constants';

export function SingleSelect<T extends { id: string; }> ({
  items,
  selectedId,
  itemKey,
  renderLabel,
  hasError,
  emptyMessage,
  onSelect,
}: SingleSelectProps<T>) {
  const getItemKey = itemKey ?? ((item: T) => item.id);
  const getLabel = renderLabel ?? ((item: T) => String((item as { name?: string; }).name ?? item.id));
  const isEmpty = items.length === 0;

  const renderItems = items.map((item) => (
    <TouchableOpacity
      key={getItemKey(item)}
      style={[styles.option, getItemKey(item) === selectedId && styles.optionSelected]}
      onPress={() => onSelect(item)}
    >
      <Text style={styles.optionText}>{getLabel(item)}</Text>
    </TouchableOpacity>
  ));

  return (
    <View style={[styles.dropdown, hasError && styles.inputError]}>
      <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled style={styles.scrollable}>
        {renderItems}
      </ScrollView>
      {isEmpty && <Text style={styles.emptyText}>{emptyMessage ?? 'No items available'}</Text>}
    </View>
  );
}
