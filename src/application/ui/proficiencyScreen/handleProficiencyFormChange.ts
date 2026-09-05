import { Dispatch, SetStateAction } from 'react';
import { ProficiencyFormData } from './constants';

export function handleProficiencyFormChange (
    setProficiencyFormData: Dispatch<SetStateAction<ProficiencyFormData>>,
) {
    return (field: keyof ProficiencyFormData, value: string) => {
        setProficiencyFormData((prev) => ({ ...prev, [field]: value }));
    };
}
