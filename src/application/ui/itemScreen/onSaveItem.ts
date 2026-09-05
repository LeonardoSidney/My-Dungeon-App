import { ItemFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { ICreateItemController, IEditItemController, IGetItemsController } from '@domain/controllers';
import { onSubmitItem } from './onSubmitItem';
import { setInitialItemState } from './setInitialItemState';
import { loadItems } from './loadItems';
import { Item } from '@domain/entities';

export async function onSaveItem (
    formData: ItemFormData,
    createItem: ICreateItemController,
    editItem: IEditItemController,
    getItems: IGetItemsController,
    setItemFormData: Dispatch<SetStateAction<ItemFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setItems: Dispatch<SetStateAction<Item[]>>
) {
    const response = await onSubmitItem(formData, createItem, editItem);
    if (!response || !response.success) return;

    setItemFormData(setInitialItemState());
    setShowForm(false);
    await loadItems(getItems, setItems);
}
