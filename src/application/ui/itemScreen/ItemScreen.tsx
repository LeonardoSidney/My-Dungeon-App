import React, { useCallback, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Item } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, useEntityScreenLoad } from '@application/ui/components';
import { useControllers } from '@adapters/ui/ControllersProvider';
import { ItemFormData, FormErrors, itemFormConfig } from './constants';
import { setInitialItemState } from './setInitialItemState';
import { handleItemFormChange } from './handleItemFormChange';
import { loadItems } from './loadItems';
import { onAddNewItem } from './onAddNewItem';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseItem } from './onEraseItem';
import { onSaveItem } from './onSaveItem';

export function ItemScreen () {
  const { getItems, createItem, editItem, eraseItem } = useControllers();
  const [items, setItems] = useState<Item[]>([]);
  const [itemStateFormData, setItemFormData] = useState<ItemFormData>(setInitialItemState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const loadEntities = useCallback(() => loadItems(getItems, setItems), [getItems, setItems]);

  useEntityScreenLoad(loadEntities);

  const handleFormSave = async () => {
    const errors: FormErrors = {};
    if (!itemStateFormData.name.trim()) errors.name = 'Name is required';
    if (!itemStateFormData.activationWord.trim()) errors.activationWord = 'Activation Word is required';
    if (!itemStateFormData.prompt.trim()) errors.prompt = 'Prompt is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    await onSaveItem(itemStateFormData, createItem, editItem, getItems, setItemFormData, setShowForm, setItems);
  };

  const handleFormChange = (field: keyof ItemFormData, value: string) => {
    setFormErrors(prev => {
      const next = { ...prev };
      const errorField = field as keyof FormErrors;
      if (next[errorField]) {
        delete next[errorField];
      }
      return next;
    });
    handleItemFormChange(setItemFormData)(field, value);
  };

  const handleAddNewItem = () => {
    setFormErrors({});
    onAddNewItem(setShowForm, setItemFormData);
  };

  const handleEditItem = (item: Item) => {
    setFormErrors({});
    onEditForm(item, setShowForm, setItemFormData);
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Items</Text>
        </View>

        <CrudEntityList
          items={items}
          emptyText="No items found."
          getDetailText={(item) => item.activationWord}
          onEdit={handleEditItem}
          onDelete={(item) => onEraseItem(item, eraseItem, getItems, setItems)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewItem}
        >
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>

        <ActivationPromptForm
          showForm={showForm}
          formData={itemStateFormData}
          config={itemFormConfig}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setItemFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}
