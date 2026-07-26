import { Dispatch, SetStateAction } from 'react';
import { WorldMasterFormData } from './constants';

export function handleWorldMasterFormChange (
    setWorldMasterFormData: Dispatch<SetStateAction<WorldMasterFormData>>
) {
    return (field: keyof WorldMasterFormData, value: any) => {
        setWorldMasterFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
}
