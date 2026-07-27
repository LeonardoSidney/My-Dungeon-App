import { Dispatch, SetStateAction } from 'react';
import { ConnectionFormData } from './constants';

export function handleConnectionFormChange (
    setConnectionFormData: Dispatch<SetStateAction<ConnectionFormData>>
) {
    return (field: keyof ConnectionFormData, value: string) => {
        setConnectionFormData((prev) => ({ ...prev, [field]: value }));
    };
}
