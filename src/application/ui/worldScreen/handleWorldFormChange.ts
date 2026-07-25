import { Dispatch, SetStateAction } from 'react';
import { WorldFormData } from './constants';

export function handleWorldFormChange (
    setWorldFormData: Dispatch<SetStateAction<WorldFormData>>
) {
    return (field: keyof WorldFormData, value: string) => {
        setWorldFormData((prev) => ({ ...prev, [field]: value }));
    };
}
