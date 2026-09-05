import { setInitialItemState } from './setInitialItemState';
import { ItemFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onAddNewItem (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setItemFormData: Dispatch<SetStateAction<ItemFormData>>,
) {
    setShowForm(true);
    setItemFormData(setInitialItemState());
}
