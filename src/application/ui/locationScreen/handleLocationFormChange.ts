import { Dispatch, SetStateAction } from 'react';
import { LocationFormData } from './constants';

export function handleLocationFormChange (
    setLocationFormData: Dispatch<SetStateAction<LocationFormData>>,
) {
    return (field: keyof LocationFormData, value: string) => {
        setLocationFormData((prev) => ({ ...prev, [field]: value }));
    };
}
