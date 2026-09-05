import { IGetItemsController } from '@domain/controllers';
import { Dispatch } from 'react';
import { Item } from '@domain/entities';

export async function loadItems (
    getItems: IGetItemsController,
    setItems: Dispatch<React.SetStateAction<Item[]>>
) {
    try {
        const result = await getItems.handle();
        setItems(result);
    } catch (error) {
        console.error('Failed to load items:', error);
    }
}
