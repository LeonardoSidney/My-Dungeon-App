import { Dispatch, SetStateAction, useEffect } from 'react';
import { Item } from '@domain/entities';
import { loadItems } from './loadItems';

export function useItemsLoad(setItems: Dispatch<SetStateAction<Item[]>>) {
    useEffect(() => {
        loadItems(setItems);
    }, [setItems]);
}
