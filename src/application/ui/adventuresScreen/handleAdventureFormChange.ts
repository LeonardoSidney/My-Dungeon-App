import { Dispatch, SetStateAction } from 'react';
import { AdventureFormData } from './constants';

export function handleAdventureFormChange(
    setAdventureFormData: Dispatch<SetStateAction<AdventureFormData>>
) {
    return (field: keyof AdventureFormData, value: any) => {
        setAdventureFormData(prev => ({ ...prev, [field]: value }));
    };
}
