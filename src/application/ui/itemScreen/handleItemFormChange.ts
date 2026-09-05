import { Dispatch, SetStateAction } from 'react';
import { ItemFormData } from './constants';

export function handleItemFormChange (
    setItemFormData: Dispatch<SetStateAction<ItemFormData>>,
) {
    return (field: keyof ItemFormData, value: string) => {
        setItemFormData((prev) => ({ ...prev, [field]: value }));
    };
}
