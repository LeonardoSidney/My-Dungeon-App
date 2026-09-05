import { Dispatch, SetStateAction } from 'react';
import { AbilityFormData } from './constants';

export function handleAbilityFormChange (
    setAbilityFormData: Dispatch<SetStateAction<AbilityFormData>>,
) {
    return (field: keyof AbilityFormData, value: string) => {
        setAbilityFormData((prev) => ({ ...prev, [field]: value }));
    };
}
