import { setInitialItemState } from './setInitialItemState';
import { ItemFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';

export function onCancelForm (
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setItemFormData: Dispatch<SetStateAction<ItemFormData>>,
) {
    setShowForm(false);
    setItemFormData(setInitialItemState());
}
