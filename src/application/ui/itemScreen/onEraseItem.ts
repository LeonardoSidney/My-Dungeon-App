import { Alert } from 'react-native';
import { IEraseItemController, IGetItemsController } from '@domain/controllers';
import { Item } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { loadItems } from './loadItems';

export async function onEraseItem (
    item: Item,
    eraseItem: IEraseItemController,
    getItems: IGetItemsController,
    setItems: Dispatch<SetStateAction<Item[]>>
) {
    const response = await eraseItem.handle(item.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to erase item');
        return;
    }
    await loadItems(getItems, setItems);
}
