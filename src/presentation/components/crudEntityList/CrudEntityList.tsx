import { memo, useEffect, useRef, type ReactNode } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { IconButton } from '../IconButton';
import { screenStyles } from '../screenStyles';
import { EntityItem } from './EntityItem';

const SCROLL_TO_FORM_DELAY_MS = 80;

export type CrudEntityListItem = {
  id: string;
  name: string;
};

export type CrudEntityListProps<T extends CrudEntityListItem> = {
  items: T[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyText: string;
  addLabel: string;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  getDetailText?: (item: T) => string;
  detailLines?: number;
  renderActions?: (item: T) => ReactNode;
  form?: ReactNode;
};

type CrudEntityRowProps<T extends CrudEntityListItem> =
  Pick<CrudEntityListProps<T>, 'onEdit' | 'onDelete' | 'getDetailText' | 'detailLines' | 'renderActions'> & { item: T; };

function CrudEntityRowBase<T extends CrudEntityListItem> ({
  item,
  onEdit,
  onDelete,
  getDetailText,
  detailLines,
  renderActions,
}: CrudEntityRowProps<T>) {
  return (
    <EntityItem
      name={item.name}
      details={getDetailText?.(item)}
      detailLines={detailLines}
      actions={renderActions ? renderActions(item) : (
        <>
          <IconButton icon={Pencil} accessibilityLabel="Edit" onPress={() => onEdit(item)} />
          <IconButton icon={Trash2} accessibilityLabel="Delete" onPress={() => onDelete(item)} />
        </>
      )}
    />
  );
}

const CrudEntityRow = memo(CrudEntityRowBase) as typeof CrudEntityRowBase;

export function CrudEntityList<T extends CrudEntityListItem> ({
  items,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load entities.',
  emptyText,
  addLabel,
  onAdd,
  onEdit,
  onDelete,
  getDetailText,
  detailLines,
  renderActions,
  form,
}: CrudEntityListProps<T>) {
  const flatListRef = useRef<FlatList<T> | null>(null);
  const isFormOpen = Boolean(form);
  const wasFormOpen = useRef(isFormOpen);

  useEffect(() => {
    const formJustOpened = isFormOpen && !wasFormOpen.current;
    wasFormOpen.current = isFormOpen;
    if (!formJustOpened) {
      return undefined;
    }
    const timeout = setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), SCROLL_TO_FORM_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [isFormOpen]);

  const renderItem = ({ item }: { item: T; }) => (
    <CrudEntityRow
      item={item}
      onEdit={onEdit}
      onDelete={onDelete}
      getDetailText={getDetailText}
      detailLines={detailLines}
      renderActions={renderActions}
    />
  );

  const renderEmpty = () => {
    if (isLoading) {
      return <Text style={screenStyles.loadingText}>Loading...</Text>;
    }
    if (isError) {
      return <Text style={screenStyles.errorText}>{errorMessage}</Text>;
    }
    return <Text style={screenStyles.emptyText}>{emptyText}</Text>;
  };

  return (
    <FlatList
      ref={flatListRef}
      style={styles.list}
      nestedScrollEnabled
      data={isLoading || isError ? [] : items}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty()}
      ListFooterComponent={(
        <>
          <TouchableOpacity style={screenStyles.addButton} onPress={onAdd}>
            <Text style={screenStyles.addButtonText}>{addLabel}</Text>
          </TouchableOpacity>
          {form}
        </>
      )}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
