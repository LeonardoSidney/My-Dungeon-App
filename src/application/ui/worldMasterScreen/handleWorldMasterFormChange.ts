import { Dispatch, SetStateAction } from 'react';
import { WorldMasterFormData } from './constants';

export function handleWorldMasterFormChange (
    setWorldMasterFormData: Dispatch<SetStateAction<WorldMasterFormData>>
) {
    return (field: keyof WorldMasterFormData, value: WorldMasterFormData[keyof WorldMasterFormData]) => {
        setWorldMasterFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
}
