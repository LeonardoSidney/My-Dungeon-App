import { useEffect, useRef } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { EntityItem } from './entityItem';
import { EntityListError } from './entityListError';
import { EntityListFooter } from './entityListFooter';
import { styles } from './styles';
import { colors } from '../../theme';
import type { CrudEntityListProps, CrudEntityListItem } from './constants';

export function CrudEntityList<T extends CrudEntityListItem> (params: CrudEntityListProps<T>) {
  const {
    items,
    isLoading,
    isError,
    errorMessage,
    emptyText,
    addLabel,
    onAdd,
    onEdit,
    onDelete,
    getDetailText,
    detailLines,
    isFormOpen,
    renderActions,
    renderForm,
  } = params;

  const flatListRef = useRef<FlatList<T> | null>(null);
  const previousFormOpen = useRef(isFormOpen === true);

  useEffect(() => {
    const isFormOpenNow = isFormOpen === true;
    const formJustOpened = isFormOpenNow && !previousFormOpen.current;
    previousFormOpen.current = isFormOpenNow;
    if (!formJustOpened) {
      return undefined;
    }
    const scrollToForm = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 80);
    return () => clearTimeout(scrollToForm);
  }, [isFormOpen]);

  const emptyItems: T[] = [];

  const renderPlaceholder = (): ReactElement => <Text />;

  const form = renderForm ? renderForm() : null;

  const footer = (
    <EntityListFooter
      addLabel={addLabel}
      onAdd={onAdd}
      form={form}
    />
  );

  const renderItem = ({ item }: { item: T; }): ReactElement => {
    const details = getDetailText ? getDetailText(item) : undefined;
    const customActions = renderActions ? renderActions(item) : null;
    const defaultActions = (
      <>
        <DefaultActionButton
          accessibilityLabel="Edit"
          onPress={() => onEdit(item)}
        >
          <Pencil size={16} color={colors.text} />
        </DefaultActionButton>
        <DefaultActionButton
          accessibilityLabel="Delete"
          onPress={() => onDelete(item)}
        >
          <Trash2 size={16} color={colors.text} />
        </DefaultActionButton>
      </>
    );
    const actions = customActions ?? defaultActions;

    return (
      <EntityItem
        name={item.name}
        details={details}
        detailLines={detailLines}
        actions={actions}
      />
    );
  };

  if (isLoading) {
    return (
      <FlatList
        ref={flatListRef}
        style={styles.list}
        data={emptyItems}
        renderItem={renderPlaceholder}
        ListEmptyComponent={<Text style={styles.loadingText}>Loading...</Text>}
        ListFooterComponent={footer}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  if (isError) {
    const errorMessageText = errorMessage ?? 'Failed to load entities.';
    return (
      <FlatList
        ref={flatListRef}
        style={styles.list}
        data={emptyItems}
        renderItem={renderPlaceholder}
        ListEmptyComponent={<EntityListError message={errorMessageText} />}
        ListFooterComponent={footer}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      style={styles.list}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}

      ListEmptyComponent={<Text style={styles.emptyText}>{emptyText}</Text>}
      ListFooterComponent={footer}
      keyboardShouldPersistTaps="handled"
    />
  );
}

function DefaultActionButton (params: { accessibilityLabel: string; onPress: () => void; children: ReactNode; }) {
  const { accessibilityLabel, onPress, children } = params;

  return (
    <TouchableOpacity
      style={styles.actionButton}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}
