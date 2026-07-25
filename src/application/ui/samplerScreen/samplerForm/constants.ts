import { MirostatEnum } from '@domain/entities';
import { SamplerFormData } from '../constants';

export interface SamplerFormProps {
    showForm: boolean;
    samplerStateFormData: SamplerFormData;
    onChange: (field: keyof SamplerFormData, value: string | Date | MirostatEnum | undefined) => void;
    onCancel: () => void;
    onSave: () => Promise<void>;
}
