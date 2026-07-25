import { Dispatch, SetStateAction } from 'react';
import { MirostatEnum } from '@domain/entities';
import { SamplerFormData } from './constants';

export function handleSamplerFormChange (
    setSamplerFormData: Dispatch<SetStateAction<SamplerFormData>>,
) {
    return (field: keyof SamplerFormData, value: string | Date | MirostatEnum | undefined) => {
        setSamplerFormData((prev) => ({ ...prev, [field]: value }));
    };
}
