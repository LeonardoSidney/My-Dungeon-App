import { getItemsController } from '@infra/container';
import { Dispatch } from 'react';
import { Item } from '@domain/entities';

export async function loadItems(
    setItems: Dispatch<React.SetStateAction<Item[]>>
) {
    try {
        const ctrl = getItemsController();
        const result = await ctrl.handle();
        setItems(result);
    } catch (error) {
        console.error('Failed to load items:', error);
    }
}
