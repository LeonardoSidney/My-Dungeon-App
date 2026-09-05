import { Item } from '@domain/entities';
import { ItemFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { setInitialItemState } from './setInitialItemState';

export function onEditForm (
    item: Item,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setItemFormData: Dispatch<SetStateAction<ItemFormData>>,
) {
    setShowForm(true);
    setItemFormData(setInitialItemState());
    setItemFormData({
        id: item.id,
        name: item.name,
        activationWord: item.activationWord,
        prompt: item.prompt,
        observation: item.observation ?? '',
    });
}
