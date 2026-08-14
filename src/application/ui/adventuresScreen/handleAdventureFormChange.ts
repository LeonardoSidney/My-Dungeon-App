import { Dispatch, SetStateAction } from 'react';
import { AdventureFormData } from './constants';

export function handleAdventureFormChange (
    setAdventureFormData: Dispatch<SetStateAction<AdventureFormData>>
) {
    return (field: keyof AdventureFormData, value: AdventureFormData[keyof AdventureFormData]) => {
        setAdventureFormData(prev => ({ ...prev, [field]: value }));
    };
}
