import { Dispatch, SetStateAction } from 'react';
import { StatusFormData } from './constants';

export function handleStatusFormChange (
    setStatusFormData: Dispatch<SetStateAction<StatusFormData>>,
) {
    return (field: keyof StatusFormData, value: string | Date) => {
        setStatusFormData((prev) => ({ ...prev, [field]: value }));
    };
}
